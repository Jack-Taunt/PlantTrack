# PlantTrack

PlantTrack Task Board
https://trello.com/b/WCK9AmoY/my-trello-board



## Run Applciation in dev

### Backend

activate .venv
```
backend> .venv/scripts/activate
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
