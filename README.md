# PlantTrack

PlantTrack is a web application designed to track and manage your plants.

* Track watering, planting and harvesting schedules
* browse different plants and their details
* compare plant growth and harvests between multiple growing seasons
* create and share your gardens and plants with other users

<br />
PlantTrack Task Board
https://trello.com/b/WCK9AmoY/my-trello-board



## Run Applciation in dev

### Backend

activate .venv
```
backend> .venv/scripts/activate
```

download required packages
```
backend> pip instll -r requirements.txt
```

run fastapi
```
backend/app> fastapi dev main.py
```

update database and run migration

1. update table in model
2. generate migration
```
backend> alembic revision --autogenerate -m "message"
```
3. apply migration
```
backend> alembic upgrade head
```

### Frontend

run react
```
frontend> npm run dev
```


### Test

to run tests
activate .venv
```
backend> .venv/scripts/activate
backend> pytest
```

For coverage numbers, requires pytest-cov


run test coverage for line coverage
```
backend> pytest --cov=app
```

run test coverage for branch coverage
```
backend> pytest --cov=app --cov-branch
```

add --cov-report=html to view overall coverage

add --cov-report=xml for use in coverage tools
