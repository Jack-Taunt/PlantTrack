from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
import pytest
from fastapi.testclient import TestClient
from app.auth.utils import hash_password
from app.models import User, Garden, Section, GardenPlant, Tag, Plant, Toxicity, Edibility, Environment, CareRequirements, Growth, Planting
import os

os.environ["SQLALCHEMY_DATABASE_URL"] = "sqlite:///:memory:"


engine = create_engine(
    os.getenv("SQLALCHEMY_DATABASE_URL"), connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)

    connection = engine.connect()
    transation = connection.begin()
    session = TestingSessionLocal(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transation.rollback()
        connection.close()


@pytest.fixture()
def client(db_session):
    """This fixture is used for unauthenticated user on the application"""
    def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db

    return TestClient(app)


@pytest.fixture()
def auth_client(client, db_session):
    """This fixture is used for an authenticated user on the application"""

    user = User(username= "testusername", email="testemail", password=hash_password("testpassword"))
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/users/token", 
        data={"username": "testemail", "password": "testpassword"}
    )
    assert response.status_code == 200
    return client


@pytest.fixture()
def default_data(db_session):
    """This fixture is used to initialise default data for use in testing"""

    user1 = User(username= "default_user1", email="default1@email.com", password=hash_password("Default_password1!"))
    user2 = User(username= "default_user2", email="default2@email.com", password=hash_password("Default_password2!"))
    db_session.add(user1)
    db_session.add(user2)

    default_tag_1 = Tag(name="default_tag_1")
    default_tag_2 = Tag(name="default_tag_2")
    default_tag_3 = Tag(name="default_tag_3")
    default_tag_4 = Tag(name="default_tag_4")
    default_tag_5 = Tag(name="default_tag_5")
    default_tag_6 = Tag(name="default_tag_6")
    db_session.add(default_tag_1)
    db_session.add(default_tag_2)
    db_session.add(default_tag_3)
    db_session.add(default_tag_4)
    db_session.add(default_tag_5)
    db_session.add(default_tag_6)

    default_garden_1 = Garden(name="default_garden_1", description="default description 1", is_public=True, tags=[], user_id=1)
    default_garden_2 = Garden(name="default_garden_2", description="default description 2", is_public=False, tags=[default_tag_1, default_tag_2, default_tag_3], user_id=1)
    default_garden_3 = Garden(name="default_garden_3", description="default description 3", is_public=False, tags=[], user_id=1)
    default_garden_4 = Garden(name="default_garden_4", description="default description 4", is_public=False, tags=[default_tag_1], user_id=2)
    default_garden_5 = Garden(name="default_garden_5", description="default description 5", is_public=True, tags=[], user_id=2)
    db_session.add(default_garden_1)
    db_session.add(default_garden_2)
    db_session.add(default_garden_3)
    db_session.add(default_garden_4)
    db_session.add(default_garden_5)

    default_section_1 = Section(name="default_section_1", garden_id=1, order=1)
    default_section_2 = Section(name="default_section_2", garden_id=2, order=1)
    default_section_3 = Section(name="default_section_3", garden_id=3, order=1)
    default_section_4 = Section(name="default_section_4", garden_id=4, order=1)
    default_section_5 = Section(name="default_section_5", garden_id=5, order=1)
    db_session.add(default_section_1)
    db_session.add(default_section_2)
    db_session.add(default_section_3)
    db_session.add(default_section_4)
    db_session.add(default_section_5)

    default_toxicity_1 = Toxicity(toxic_to_cats=False, toxic_to_dogs=False, toxic_to_humans=False, toxicity="non_toxic")
    db_session.add(default_toxicity_1)

    default_edibility_1 = Edibility(edible_fruit=True, edible_leaves=False, edible_flowers=False, edible_roots=False)
    db_session.add(default_edibility_1)

    default_environment_1 = Environment(light_type="bright_indirect_light", min_temp=15.0, max_temp=30.0, min_humidity=20.0, max_humidity=50.0, min_usda_zone="8", max_usda_zone="11")
    db_session.add(default_environment_1)

    default_care_requirements_1 = CareRequirements(min_water_frequency=5, max_water_frequency=15, soil_moisture="moderate", drought_tolerant=False, soil_type="loamy", min_soil_ph=6.0, max_soil_ph=8.0, fertilizer_frequency=14, fertilizer_nitrogen=5, fertilizer_phosphorus=10, fertilizer_potassium=10)
    db_session.add(default_care_requirements_1)

    default_growth_1 = Growth(annual=True, biennial=False, perennial=False, max_height=100.0, max_width=50.0, growth_rate="moderate", min_days_to_harvest=50, max_days_to_harvest=80)
    db_session.add(default_growth_1)

    default_planting_1 = Planting(spacing=15.0, seed_depth=5.0, direct_sow=True, transplant=True, propagation=True)
    db_session.add(default_planting_1)

    default_plant_1 = Plant(common_name="default_plant_1", 
                            scientific_name="default_scientific_1", 
                            genus="default_genus_1", 
                            order="default_order_1", 
                            class_="default_class_1", 
                            phylum="default_phylum_1", 
                            variety="default_variety_1",
                            toxicity_id=1,
                            edibility_id=1,
                            environment_id=1,
                            care_requirements_id=1,
                            growth_id=1,
                            planting_id=1,
                            )
    default_plant_2 = Plant(common_name="default_plant_2", 
                            scientific_name="default_scientific_2", 
                            genus="default_genus_2", 
                            order="default_order_2", 
                            class_="default_class_2", 
                            phylum="default_phylum_2", 
                            variety="default_variety_2",
                            toxicity_id=1,
                            edibility_id=1,
                            environment_id=1,
                            care_requirements_id=1,
                            growth_id=1,
                            planting_id=1,
                            )
    default_plant_3 = Plant(common_name="default_plant_3", 
                            scientific_name="default_scientific_3", 
                            genus="default_genus_3", 
                            order="default_order_3", 
                            class_="default_class_3", 
                            phylum="default_phylum_3", 
                            variety="default_variety_3",
                            toxicity_id=1,
                            edibility_id=1,
                            environment_id=1,
                            care_requirements_id=1,
                            growth_id=1,
                            planting_id=1,
                            )
    db_session.add(default_plant_1)
    db_session.add(default_plant_2)
    db_session.add(default_plant_3)

    default_garden_plant_1 = GardenPlant(garden_id=1, plant_id=1, section_id=1)
    default_garden_plant_2 = GardenPlant(garden_id=1, plant_id=2, section_id=1)
    db_session.add(default_garden_plant_1)
    db_session.add(default_garden_plant_2)

    default_garden_plant_3 = GardenPlant(garden_id=2, plant_id=1, section_id=2)
    default_garden_plant_4 = GardenPlant(garden_id=2, plant_id=2, section_id=2)
    db_session.add(default_garden_plant_3)
    db_session.add(default_garden_plant_4)

    db_session.commit()