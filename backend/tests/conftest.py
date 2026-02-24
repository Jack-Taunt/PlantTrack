from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
import pytest
from fastapi.testclient import TestClient
from app.auth.utils import hash_password
from app.models import User, Garden, Tag

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
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
    default_garden_3 = Garden(name="default_garden_3", description="default description 3", is_public=True, tags=[default_tag_1], user_id=2)
    default_garden_4 = Garden(name="default_garden_4", description="default description 4", is_public=False, tags=[], user_id=2)
    db_session.add(default_garden_1)
    db_session.add(default_garden_2)
    db_session.add(default_garden_3)
    db_session.add(default_garden_4)

    db_session.commit()