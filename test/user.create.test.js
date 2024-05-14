// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const server = require('../index')
// const tracer = require('tracer')
//
//
// chai.should()
// chai.use(chaiHttp)
// tracer.setLevel('warn')
//
// const endpointToTest = '/api/user'
//
// describe('UC201 Registreren als nieuwe user', () => {
//     beforeEach((done) => {
//         console.log('Before each test')
//         done()
//     })
//
//     it('TC-101-1 Verplicht veld ontbreekt', (done) => {
//         chai.request(server)
//             .post(endpointToTest)
//             .send({
//                 firstName: 'John',
//                 lastName: 'Deere',
//                 // emailAdress: 'j.deere@gmail.com',  // Missing emailAdress field
//                 password: 'secret'
//             })
//             .end((err, res) => {
//                 console.log('Response body:', res.body);  // Log response body for debugging
//                 console.log('Response status:', res.status);  // Log status code for debugging
//
//                 chai.expect(res).to.have.status(400);  // Expecting 400 status code
//                 chai.expect(res.body).to.be.a('object');
//                 chai.expect(res.body).to.have.property('status').equals(400);
//                 chai.expect(res.body).to.have.property('message').equals('emailAdress is required');
//
//                 done();
//             });
//     });
//
//
//     it('TC-201-2 Niet-valide email adres', (done) => {
//         chai.request(server)
//             .post(endpointToTest)
//             .send({
//                 firstName: 'Voornaam',
//                 lastName: 'Achternaam',
//                 emailAdress: 'john@server.nl',
//                 password: 'StrongPassword123' // Password doesn't meet requirements
//             })
//             .end((err, res) => {
//                 chai.expect(res).to.have.status(400)
//                 chai.expect(res.body).to.have.property('message').equals('emailAddress should match the pattern')
//                 done()
//             })
//     })
//
//     it('TC-201-3 Niet-valide password', (done) => {
//         chai.request(server)
//             .post(endpointToTest)
//             .send({
//                 firstName: 'Voornaam',
//                 lastName: 'Achternaam',
//                 emailAdress: 'v.aaa@server.nl',
//                 password: 'weakpassword' // Password doesn't meet requirements
//             })
//             .end((err, res) => {
//                 chai.expect(res).to.have.status(400)
//                 chai.expect(res.body).to.have.property('message').equals('password should match the pattern')
//                 done()
//             })
//     })
//
//     it('TC-201-4 Gebruiker bestaat al', (done) => {
//         chai
//             .request(server)
//             .post(endpointToTest)
//             .send(
//                 {
//                     firstName: 'Mariëtte',
//                     lastName: 'van den Dullemen',
//                     emailAdress: 'm.vandullemen@server.nl',
//                     isActive: 1,
//                     password: 'Secret12!',
//                     phoneNumber: '0612345678',
//                     roles: ['admin', 'user'],
//                     street: 'Kerkstra 1',
//                     city: 'Amsterdam',
//                 }
//             )
//             .end((err, res) => {
//                 chai.expect(res).to.have.status(400); // Assuming 400 is the expected status for duplicate user
//                 chai.expect(res.body).to.be.an('object');
//                 chai.expect(res.body.status).to.equal(400);
//                 chai.expect(res.body.message).to.equal(
//                     `User already exists.`
//                 );
//                 chai.expect(res.body.data).to.be.an('object').that.is.empty;
//                 done();
//             });
//     });
//
//
//
//     it.skip('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
//         chai.request(server)
//             .post(endpointToTest)
//             .send({
//                 firstName: 'Johan',
//                 lastName: 'Achternaam',
//                 emailAdress: 'j.aaaaa@server.nl',
//                 password: 'StrongPassword123' // Valid password
//             })
//             .end((err, res) => {
//                 // Expecting status code 200 for successful registration
//                 res.should.have.status(200);
//                 res.body.should.be.a('object');
//
//                 // Check response body properties
//                 const data = res.body.data;
//                 res.body.should.have.property('data').that.is.a('object');
//                 res.body.should.have.property('message').that.is.a('string');
//                 data.should.have.property('firstName').equals('Voornaam');
//                 data.should.have.property('lastName').equals('Achternaam');
//                 data.should.have.property('emailAdress').equals('v.aaa@server.nl');
//                 data.should.have.property('id').that.is.a('number');
//
//                 // Additional checks for the response message and data
//                 res.body.message.should.equal('User created.');
//                 data.should.not.have.property('password'); // Ensure password is not returned in the response
//
//                 // Delete the user after assertions
//                 chai.request(server)
//                     .delete(endpointToTest + `/${data.id}`)
//                     .end((err, res) => {
//                         // Assuming deletion is successful
//                         res.should.have.status(200);
//                         done();
//                     });
//             });
//     });
//
//
//
// })
