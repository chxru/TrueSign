# TrueSign - FYP

## Applications and Services

### Admin Portal

- Invite users
- Add students

### Web Portal

- Create modules
- Add students to modules
- Upload sign sheets to respective modules

### API

- Handles HTTP requests

### Table2Cell

- Image pre-processing
- Extracting cells from tabular attendance sheets

## Getting Started

Make sure nx and poetry is installed globally

For [nx](https://nx.dev/getting-started/installation):

```bash
npm install -g nx yarn
```

For [poetry](https://python-poetry.org/docs/#installation):

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

or in powershell

```ps
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

Then Install dependencies

```bash
yarn
poetry install
```

## Running the Project

### API

```base
nx run api:serve
```

### Admin Portal

```bash
nx run admin:serve
```

### Web Portal

```bash
nx run web:serve
```

### Table2Cell

```base
poetry run python apps/services/table2cell/table2cell/index.py
```
