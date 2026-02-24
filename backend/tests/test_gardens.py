from app.models.User import User
from app.models.Garden import Garden
import pytest
from sqlalchemy.orm import joinedload
from app.schemas.Garden import Tag

def test_get_public_gardens_empty_returns_empty_list(client):
    response = client.get("/gardens/public")
    assert response.status_code == 200
    assert response.json() == []


def test_get_public_gardens_returns_garden_list(client, default_data):
    response = client.get("/gardens/public")
    assert response.status_code == 200
    assert len(response.json()) == 2
    for garden in response.json():
        assert garden["is_public"] == True
        assert garden["name"] != None
        assert garden["description"] != None
        assert garden["tags"] != None
        assert garden["user"] != None


def test_get_my_gardens_returns_garden_list(auth_client, default_data, db_session):
    response = auth_client.get("/gardens/me")
    assert response.status_code == 200
    assert len(response.json()) == 2

    testuser = db_session.query(User).filter(User.username == "testusername").first()

    for garden in response.json():
        assert garden["user_id"] == testuser.id
        assert garden["is_public"] != None
        assert garden["name"] != None
        assert garden["description"] != None
        assert garden["tags"] != None


def test_get_my_gardens_signed_out_returns_401(client, default_data, db_session):
    response = client.get("/gardens/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


@pytest.mark.parametrize(
        "payload",
        [
            {"name": "test name1", "description": "test description", "is_public": True, "tags": []},
            {"name": "a"*30, "description": "test description", "is_public": True, "tags": []},
            {"name": "test name2", "description": "a"*256, "is_public": True, "tags": []},
            {"name": "test name3", "description": "test description", "is_public": False, "tags": []},
            {"name": "test name4", "description": "test description", "is_public": True, "tags": [1, 2, 3, 4, 5]},
        ]
)
def test_post_create_garden_correct_details_garden_created(payload, auth_client, default_data, db_session):
    response = auth_client.post(
        "/gardens",
        json=payload
    )
    assert response.status_code == 200

    garden = (
        db_session.query(Garden)
        .options(joinedload(Garden.user))
        .filter(Garden.name == payload["name"])
        .options(joinedload(Garden.tags))
        .first()
    )

    assert garden != None
    assert garden.name == payload["name"]
    assert garden.description == payload["description"]
    assert garden.is_public == payload["is_public"]
    for i in range(len(garden.tags)):
        assert garden.tags[i-1].id == payload["tags"][i-1]


def test_post_create_garden_unauthorised_401_recieved(client, db_session):
    response = client.post(
        "/gardens",
        json={
            "name": "test name", 
            "description": "test description", 
            "is_public": True, 
            "tags": []
        }
    )
    assert response.status_code == 401
    garden = (
        db_session.query(Garden)
        .options(joinedload(Garden.user))
        .filter(Garden.name == "test name")
        .first()
    )
    assert garden == None


@pytest.mark.parametrize(
        "payload,field,message",
        [
            ({"name": "a"*31, "description": "test description", "is_public": True, "tags": []}, "name", "String should have at most 30 characters"),
            ({"name": "test name", "description": "a"*257, "is_public": True, "tags": []}, "description", "String should have at most 256 characters"),
            ({"name": "test name", "description": "test description", "is_public": True, "tags": [1,2,3,4,5,6]}, "tags", "List should have at most 5 items after validation, not 6"),
        ]
)
def test_post_create_garden_invalid_details_401_recieved(payload, field, message, auth_client, db_session):
    response = auth_client.post(
        "/gardens",
        json=payload
    )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][1] == field
    assert response.json()["detail"][0]["msg"] == message
    garden = (
        db_session.query(Garden)
        .options(joinedload(Garden.user))
        .filter(Garden.name == "test name")
        .first()
    )
    assert garden == None


def test_get_tags_200_recieved(client, default_data):
    response = client.get(
        "/gardens/tags",
    )
    assert response.status_code == 200
    assert len(response.json()) == 6


def test_delete_garden_not_auth_401_recieved(client, default_data, db_session):
    gardens = (
        db_session.query(Garden)
        .all()
    )
    assert len(gardens) == 4


    response = client.delete(
        "/gardens/1",
    )
    assert response.status_code == 401

    gardens = (
        db_session.query(Garden)
        .all()
    )

    assert len(gardens) == 4


def test_delete_garden_auth_owned_garden_200_recieved(auth_client, default_data, db_session):
    gardens = (
        db_session.query(Garden)
        .all()
    )
    assert len(gardens) == 4
    garden = None
    for g in gardens:
        if g.id == 1:
            garden = g
    assert garden != None

    response = auth_client.delete(
        "/gardens/1",
    )
    assert response.status_code == 200

    gardens = (
        db_session.query(Garden)
        .all()
    )

    assert len(gardens) == 3
    garden = None
    for g in gardens:
        if g.id == 1:
            garden = g
    assert garden == None


def test_delete_garden_auth_not_owned_garden_403_recieved(auth_client, default_data, db_session):
    gardens = (
        db_session.query(Garden)
        .all()
    )
    assert len(gardens) == 4
    garden = None
    for g in gardens:
        if g.id == 3:
            garden = g
    assert garden != None

    response = auth_client.delete(
        "/gardens/3",
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not own this garden!"

    gardens = (
        db_session.query(Garden)
        .all()
    )

    assert len(gardens) == 4
    garden = None
    for g in gardens:
        if g.id == 3:
            garden = g
    assert garden != None


def test_get_garden_invalid_id_401_recieved(client):
    response = client.get(
        "/gardens/999",
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This garden doesn't exist!"


def test_get_garden_not_auth_403_recieved(client, default_data):
    response = client.get(
        "/gardens/2",
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not own this garden!"


def test_get_garden_public_garden_not_auth_200_recieved(client, default_data):
    response = client.get(
        "/gardens/1",
    )
    assert response.status_code == 200
    assert response.json()["id"] == 1
    assert response.json()["name"] == "default_garden_1"
    assert response.json()["description"] == "default description 1"
    assert response.json()["is_public"] == True


def test_get_garden_private_garden_auth_200_recieved(auth_client, default_data):
    response = auth_client.get(
        "/gardens/2",
    )
    assert response.status_code == 200
    assert response.json()["id"] == 2
    assert response.json()["name"] == "default_garden_2"
    assert response.json()["description"] == "default description 2"
    assert response.json()["is_public"] == False