# Collaborative Work in Spreadsheets using okdb

Sample of using [okdb](https://okdb.io/) to implement multi-user collaboration in [Excel-like React Spreadsheets](https://github.com/okdb-io/okdb-spreadsheet).

## Backend

The backend is a node.js service, needed to broadcast changes to connected clients. 

## Frontend

The frontend is a react app generated with <a href="https://reactjs.org/docs/create-a-new-react-app.html">CRA</a> and using <a href="https://material-ui.com/">Material UI</a> components.


## Getting Started

In your first terminal:

```
git clone https://github.com/okdb-io/okdb-sample-spreadsheet.git
cd okdb-sample-spreadsheet/backend/
npm install
npm run server
```

In your second terminal:

```
cd okdb-sample-spreadsheet/frontend/
npm install
npm start
```

Open <a href="http://localhost:3000">landing page</a> in two different browser windows, make changes in one window and see them in another one.


## Next Steps

See <a href="https://okdb.io/p/docs/getting-started">documentation</a> for more information.
