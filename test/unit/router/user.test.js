const axios = require("axios").default;
const mongoose = require("mongoose");
let config = {
    url: "http://127.0.0.1:8000"
}
let User;
beforeEach(() => {
    require("../../../src/models/Repository");
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});



test('register', (done) => {
    axios.post(`${config.url}/api/user/register`, {
        name: "sam",
        username: "sammy",
        password: "M00nLight",
        email: "sam@gmail.com"
    }, {
        headers: {
            "content-type": "application/json",
        }
    }).then(result => {
        console.log(result);
        done();
    }).catch((e) => {
        expect(e.response.status).toBe(201);
        done(new Error({data: e.response.data }));
    })
});