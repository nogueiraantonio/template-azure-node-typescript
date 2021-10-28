//Dependencies declarations
import express from 'express'; // Web application/services engine

//initialization
const app = express();

//Serve static files from the local directory
app.use('/', express.static(`${__dirname}/../client`));

//app.get('/', (req, res) => { res.send("Hello World - 12.18.0"); } );

const port = process.env.PORT || 4999;

app.set('port', port);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
