from app.models.Garden import Section

def test_create_section_not_auth_401_recieved(client, default_data):
    response = client.post(
        "/gardens/1/section",
        json={"name": "section"}
    )
    assert response.status_code == 401


def test_create_section_garden_doesnt_exist_404_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/999/section",
        json={"name": "section"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This garden doesn't exist!"


def test_create_section_garden_doesnt_own_garden_403_recieved(auth_client, default_data):
    response = auth_client.post(
        "/gardens/4/section",
        json={"name": "section"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not own this garden!"


def test_create_section_correct_details_200_recieved(auth_client, default_data, db_session):
    sections = (
        db_session.query(Section)
        .filter(Section.garden_id == 1)
        .all()
    )
    assert len(sections) == 1
    
    response = auth_client.post(
        "/gardens/1/section",
        json={"name": "section_2"}
    )
    assert response.status_code == 200
    assert response.json()["id"] == 6
    assert response.json()["name"] == "section_2"

    sections = (
        db_session.query(Section)
        .filter(Section.garden_id == 1)
        .all()
    )
    assert len(sections) == 2


def test_edit_section_not_auth_401_recieved(client, default_data):
    response = client.put(
        "/gardens/1/section/1",
        json={"name": "new_section_name", "description": "new_section_description"}
    )
    assert response.status_code == 401


def test_edit_section_garden_doesnt_exist_404_recieved(auth_client, default_data):
    response = auth_client.put(
        "/gardens/999/section/1",
        json={"name": "new_section_name", "description": "new_section_description"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This garden doesn't exist!"


def test_edit_section_section_doesnt_exist_404_recieved(auth_client, default_data):
    response = auth_client.put(
        "/gardens/1/section/999",
        json={"name": "new_section_name", "description": "new_section_description"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This section doesn't exist!"


def test_edit_section_doesnt_own_garden_403_recieved(auth_client, default_data):
    response = auth_client.put(
        "/gardens/4/section/4",
        json={"name": "new_section_name", "description": "new_section_description"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not own this garden!"


def test_edit_section_correct_details_200_recieved(auth_client, default_data, db_session):
    
    response = auth_client.put(
        "/gardens/1/section/1",
        json={"name": "new_section_name", "description": "new_section_description"}
    )
    assert response.status_code == 200
    assert response.json()["id"] == 1
    assert response.json()["name"] == "new_section_name"
    assert response.json()["description"] == "new_section_description"

    sections = (
        db_session.query(Section)
        .filter(Section.garden_id == 1)
        .all()
    )
    assert len(sections) == 1
    assert sections[0].name == "new_section_name"
    assert sections[0].description == "new_section_description"


def test_delete_section_not_auth_401_recieved(client, default_data):
    response = client.delete(
        "/gardens/1/section/1"
    )
    assert response.status_code == 401


def test_delete_section_garden_doesnt_exist_404_recieved(auth_client, default_data):
    response = auth_client.delete(
        "/gardens/999/section/1"
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This garden doesn't exist!"


def test_delete_section_section_doesnt_exist_404_recieved(auth_client, default_data):
    response = auth_client.delete(
        "/gardens/1/section/999"
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "This section doesn't exist!"


def test_delete_section_doesnt_own_garden_403_recieved(auth_client, default_data):
    response = auth_client.delete(
        "/gardens/4/section/4"
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "You do not own this garden!"


def test_delete_section_correct_details_200_recieved(auth_client, default_data, db_session):
    
    response = auth_client.delete(
        "/gardens/1/section/1"
    )
    assert response.status_code == 200

    sections = (
        db_session.query(Section)
        .filter(Section.garden_id == 1)
        .all()
    )
    assert len(sections) == 0