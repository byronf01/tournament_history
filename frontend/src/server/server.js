const mongoose = require("mongoose");


async function connect(URI) {
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB Connected: ${connection.connection.host}`)
}

async function retrieve() {
    let data;

    const PASSWORD = process.env.PASSWORD
    const URI = "mongodb+srv://byronfong:" + PASSWORD + "@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"
    connect(URI).catch(err => console.log(err));

    const tournSchema = new mongoose.Schema({ });

    const Tourn = mongoose.model('tournament_history', tournSchema);
        
    Tourn.find((err, tourns) => {
    if (err) {
        console.error(err);
    } else {
        data = tourns
    }
    });

    return data;

}

export default connect;

