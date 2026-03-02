

def test_get_public_plants_empty_returns_empty_list(client):
    response = client.get("/plants/public")
    assert response.status_code == 200
    assert response.json() == []


def test_get_public_plants_returns_plant_list(client, default_data):
    response = client.get("/plants/public")
    assert response.status_code == 200
    assert len(response.json()) == 3
    for plant in response.json():
        assert plant["common_name"] != None
        assert plant["scientific_name"] != None
        assert plant["toxicity"] != None
        assert plant["edibility"] != None
        assert plant["environment"] != None
        assert plant["care_requirements"] != None
        assert plant["growth"] != None
        assert plant["planting"] != None
