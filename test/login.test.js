const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const tracer = require('tracer');

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/auth/login';

describe('UC101 Inloggen', () => {
    beforeEach((done) => {
        console.log('Before each test');
        done();
    });

    it('TC-101-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                password: 'secret'
            })
            .end((err, res) => {
                console.log('Response body:', res.body);  // Log response body for debugging
                console.log('Response status:', res.status);  // Log status code for debugging

                chai.expect(res).to.have.status(400);  // Expecting 400 status code
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(400);
                chai.expect(res.body).to.have.property('message').equals('missing emailAdress');

                done();
            });
    });

    it('TC-101-2 Niet-valide wachtwoord', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'm.vandullemen@server.nl',
                password: 12345  // Invalid password format (not a string)
            })
            .end((err, res) => {
                console.log('Response body:', res.body);  // Log response body for debugging
                console.log('Response status:', res.status);  // Log status code for debugging

                chai.expect(res).to.have.status(400);  // Expecting 400 status code
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(400);
                chai.expect(res.body).to.have.property('message').equals('password must be a string');

                done();
            });
    });

    it('TC-101-3 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'nonexistent@server.nl',  // Non-existent user
                password: 'secret'
            })
            .end((err, res) => {
                console.log('Response body:', res.body);  // Log response body for debugging
                console.log('Response status:', res.status);  // Log status code for debugging

                chai.expect(res).to.have.status(404);  // Expecting 404 status code
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(404);
                chai.expect(res.body).to.have.property('message').equals('User not found');

                done();
            });
    });

    it('TC-101-4 Gebruiker succesvol ingelogd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'm.vandullemen@server.nl',
                password: 'secret'
            })
            .end((err, res) => {
                console.log('Response body:', res.body);  // Log response body for debugging
                console.log('Response status:', res.status);  // Log status code for debugging

                chai.expect(res).to.have.status(200);  // Expecting 200 status code
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(200);
                chai.expect(res.body).to.have.property('message').equals('User logged in');
                chai.expect(res.body).to.have.property('data').that.includes.keys('id', 'emailAdress', 'firstName', 'lastName', 'token');

                done();
            });
    });

});
