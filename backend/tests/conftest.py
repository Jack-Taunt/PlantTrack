from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
import pytest
from fastapi.testclient import TestClient
from app.auth.utils import hash_password
from app.models import User, Garden

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

    user = User(username= "default_user", email="default@email.com", password=hash_password("default_password"))
    db_session.add(user)

    default_garden_1 = Garden(name="default_garden_1", description="default description 1", is_public=True, tags=[], user_id=1)
    db_session.add(default_garden_1)

    db_session.commit()