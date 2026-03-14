from app.models.Garden import GardenPlant
from datetime import date, timedelta

def test_get_garden_private_garden_auth_200_recieved(auth_client, default_data):
    response = auth_client.get(
        "/gardens/2",
    )
    assert response.status_code == 200
    assert response.json()["id"] == 2
    assert response.json()["name"] == "default_garden_2"
    assert response.json()["description"] == "default description 2"
    assert response.json()["is_public"] == False


def test_create_garden_plants_not_auth_401_recieved(client, default_data):
    response = client.post(
        "/gardens/1/plants",
        json=[1, 2, 3]
    )
    assert response.status_code == 401


def test_create_garden_plants_not_owning_garden_403_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/4/plants",
        json={"plants": [{"plant_id": 1, "amount": 1}, {"plant_id": 2, "amount": 2}, {"plant_id": 3, "amount": 3}], "planted_date": None, "section_id": 4}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not own this garden!"


def test_create_garden_plants_non_existant_plant_404_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/1/plants",
        json={"plants": [{"plant_id": 999, "amount": 1}, {"plant_id": 1000, "amount": 2}, {"plant_id": 1001, "amount": 3}], "planted_date": None, "section_id": 1}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This plant doesnt exist!"


def test_create_garden_plants_non_existant_garden_404_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/9999/plants",
        json={"plants": [{"plant_id": 1, "amount": 1}, {"plant_id": 2, "amount": 2}, {"plant_id": 3, "amount": 3}], "planted_date": None, "section_id": 1}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This garden doesnt exist!"


def test_create_garden_plants_incorrect_date_422_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/1/plants",
        json={"plants": [{"plant_id": 1, "amount": 1}, {"plant_id": 2, "amount": 2}, {"plant_id": 3, "amount": 3}], "planted_date": str(date.today() + timedelta(days=1)), "section_id": 1}
    )
    assert response.status_code == 422
    assert response.json()["detail"][0]["msg"] == "Value error, Planted date cannot be in the future!"


def test_create_garden_plants_nonexistant_section_404_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/1/plants",
        json={"plants": [{"plant_id": 1, "amount": 1}, {"plant_id": 2, "amount": 2}, {"plant_id": 3, "amount": 3}], "planted_date": str(date.today()), "section_id": 9999}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This section doesnt exist!"


def test_create_garden_plants_garden_doesnt_own_section_403_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/1/plants",
        json={"plants": [{"plant_id": 1, "amount": 1}, {"plant_id": 2, "amount": 2}, {"plant_id": 3, "amount": 3}], "planted_date": str(date.today()), "section_id": 2}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "This garden doesn't own this section!"


def test_create_garden_plants_garden_plant_correct_date_created_200_recieved(auth_client, default_data, db_session):
    garden_plants = (
        db_session.query(GardenPlant)
        .filter(GardenPlant.garden_id == 3)
        .all()
    )
    assert len(garden_plants) == 0
    
    response = auth_client.post(
        "/gardens/3/plants",
        json={"plants": [{"plant_id": 1, "amount": 1}, {"plant_id": 2, "amount": 2}, {"plant_id": 3, "amount": 3}], "planted_date": str(date.today()), "section_id": 3}
    )
    assert response.status_code == 200

    garden_plants = (
        db_session.query(GardenPlant)
        .filter(GardenPlant.garden_id == 3)
        .all()
    )
    assert len(garden_plants) == 6

    for garden_plant in garden_plants:
        assert garden_plant.planted_date == date.today()
        assert garden_plant.notes == None
        assert garden_plant.garden_id == 3
        assert garden_plant.plant_id != None


def test_get_garden_plants_garden_doesnt_exist_404_recieved(client):
    
    response = client.get(
        "/gardens/999/plants"
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This garden doesn't exist!"


def test_get_garden_plants_public_garden_unauth_plants_recieved(client, default_data):
    
    response = client.get(
        "/gardens/1/plants"
    )
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_get_garden_plants_private_garden_unauth_403_recieved(client, default_data):
    
    response = client.get(
        "/gardens/2/plants"
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not own this garden!"


def test_get_garden_plants_private_garden_auth_200_recieved(auth_client, default_data):
    
    response = auth_client.get(
        "/gardens/2/plants"
    )
    assert response.status_code == 200
    assert len(response.json()) == 2