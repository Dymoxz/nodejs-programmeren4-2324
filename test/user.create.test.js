const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC201 Registreren als nieuwe user', () => {
    /**
     * Voorbeeld van een beforeEach functie.
     * Hiermee kun je code hergebruiken of initialiseren.
     */
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    /**
     * Hier starten de testcases
     */
    it('TC-201-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // firstName: 'Voornaam', ontbreekt
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl'
            })
            .end((err, res) => {
                /**
                 * Voorbeeld uitwerking met chai.expect
                 */
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Missing or incorrect firstName field')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
    })

    it('TC-201-2 Niet-valide email adres', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'invalidemail'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(400);
                chai.expect(res.body).to.have.property('message').equals('Invalid emailAdress field');
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                done();
            });
    });

    it('TC-201-3 Niet-valide password', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl',
                password: 'weakpassword'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400);
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(400);
                chai.expect(res.body).to.have.property('message').equals('Invalid password field');
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                done();
            });
    });

    it('TC-201-4 Gebruiker bestaat al', (done) => {
        // Simuleer een bestaande gebruiker
        const existingUser = {
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAdress: 'hvd@server.nl',
            password: "Welkom1"
        };

        // Maak een POST-verzoek om dezelfde gebruiker opnieuw te registreren
        chai.request(server)
            .post(endpointToTest)
            .send(existingUser)
            .end((err, res) => {
                chai.expect(res).to.have.status(409); // Verwacht een 'Conflict' status
                chai.expect(res.body).to.be.a('object');
                chai.expect(res.body).to.have.property('status').equals(409);
                chai.expect(res.body).to.have.property('message').equals('User already exists');
                chai.expect(res.body).to.have.property('data').that.is.a('object').that.is.empty;
                done();
            });
    });

    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl'
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Voornaam')
                data.should.have.property('lastName').equals('Achternaam')
                data.should.have.property('emailAdress')
                data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
