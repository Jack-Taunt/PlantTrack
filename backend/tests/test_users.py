import pytest

def test_post_user_token_correct_details_logs_in(client, default_data):
    response = client.post(
        "/users/token", 
        data={"username": "default1@email.com", "password": "Default_password1!"}
    )
    assert response.status_code == 200
    token = response.cookies.get("access_token")
    assert token is not None


@pytest.mark.parametrize(
        "payload",
        [
            {"username": "non-existant-email", "password": "default_password"},
            {"username": "default@email.com", "password": "wrong_password"},
            {"username": "non-existant-email", "password": "wrong_password"}
        ]
)
def test_post_user_token_incorrect_details_error_received(payload, client, default_data):
    response = client.post(
        "/users/token", 
        data=payload
    )
    assert response.status_code == 401
    token = response.cookies.get("access_token")
    assert token is None


@pytest.mark.parametrize(
        "payload",
        [
            {"email": "default1@email.com", "username": "test_username", "password": "Default_password1"},
            {"email": "default1@email.com", "username": "test_username", "password": "Wrong_password1"},
            {"email": "default1@email.com", "username": "default_user", "password": "Default_password1"}
        ]
)
def test_post_register_existing_email_409_received(payload, client, default_data):
    response = client.post(
        "/users/register",
        json=payload
    )
    assert response.status_code == 409
    assert response.json()["detail"] == "Email Already in use"


@pytest.mark.parametrize(
        "payload,field,message",
        [
            ({"email": "bad", "username": "test_username", "password": "Default_password1"}, "email", "value is not a valid email address: An email address must have an @-sign."),
            ({"email": "bad@", "username": "test_username", "password": "Default_password1"}, "email", "value is not a valid email address: There must be something after the @-sign."),
            ({"email": "bad@bad", "username": "test_username", "password": "Default_password1"}, "email", "value is not a valid email address: The part after the @-sign is not valid. It should have a period."),
            ({"email": "bad@bad.", "username": "test_username", "password": "Default_password1"}, "email", "value is not a valid email address: An email address cannot end with a period."),
            ({"email": "@bad.bad", "username": "test_username", "password": "Default_password1"}, "email", "value is not a valid email address: There must be something before the @-sign."),
            ({"email": "bad@_.bad", "username": "test_username", "password": "Default_password1"}, "email", "value is not a valid email address: The part after the @-sign contains invalid characters: '_'."),
            ({"email": 123, "username": "test_username", "password": "Default_password1"}, "email", "Input should be a valid string"),
            ({"email": "good@good.good", "username": "aa", "password": "Default_password1"}, "username", "String should have at least 3 characters"),
            ({"email": "good@good.good", "username": "aaaaaaaaaaaaaaaaaaaaa", "password": "Default_password1"}, "username", "String should have at most 20 characters"),
            ({"email": "good@good.good", "username": 123, "password": "Default_password1"}, "username", "Input should be a valid string"),
            ({"email": "good@good.good", "username": "test_username", "password": "aaaaaaa"}, "password", "String should have at least 8 characters"),
            ({"email": "good@good.good", "username": "test_username", "password": "aaaaaaaa"}, "password", "Value error, Password must have an uppercase, lowercase, digit and special character"),
            ({"email": "good@good.good", "username": "test_username", "password": "AAAAAAAA"}, "password", "Value error, Password must have an uppercase, lowercase, digit and special character"),
            ({"email": "good@good.good", "username": "test_username", "password": "Aaaaaaaa"}, "password", "Value error, Password must have an uppercase, lowercase, digit and special character"),
            ({"email": "good@good.good", "username": "test_username", "password": "Aaaaaaaa1"}, "password", "Value error, Password must have an uppercase, lowercase, digit and special character"),
        ]
)
def test_post_register_valid_details_200_received(payload, field, message, client, default_data):
    response = client.post(
        "/users/register",
        json=payload
    )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][1] == field
    assert response.json()["detail"][0]["msg"] == message


@pytest.mark.parametrize(
        "payload",
        [
            {"email": "good@good.good", "username": "test_username", "password": "Default_password1"},
            {"email": "a@a.a", "username": "test_username", "password": "Default_password1"},
            {"email": "good@good.good", "username": "aaa", "password": "Default_password1"},
            {"email": "good@good.good", "username": "aaaaaaaaaaaaaaaaaaaa", "password": "Default_password1"},
            {"email": "good@good.good", "username": "test_username", "password": "Aaaaaa1!"},
        ]
)
def test_post_register_invalid_details_409_received(payload, client, default_data):
    response = client.post(
        "/users/register",
        json=payload
    )
    assert response.status_code == 200
    assert response.json()["email"] == payload["email"]
    assert response.json()["username"] == payload["username"]
    assert "password" not in response.json()


def test_get_current_user_logged_in_returns_user(auth_client):
    response = auth_client.get(
        "/users/me", 
    )
    assert response.status_code == 200
    assert response.json()["email"] == "testemail"
    assert response.json()["username"] == "testusername"
    assert "password" not in response.json()


def test_get_current_user_logged_out_returns_401(client):
    response = client.get(
        "/users/me", 
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_post_logout_logged_in_returns_200(auth_client):
    assert "access_token" in auth_client.cookies
    response = auth_client.post(
        "/users/logout", 
    )
    assert response.status_code == 200
    assert response.json()["message"] == "logout successful"
    assert auth_client.cookies.get("access_token") == None


def test_post_logout_logged_out_returns_200(client):
    assert client.cookies.get("access_token") == None
    response = client.post(
        "/users/logout", 
    )
    assert response.status_code == 200
    assert response.json()["message"] == "logout successful"
    assert client.cookies.get("access_token") == None