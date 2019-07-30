process.env.NODE_ENV = 'test';

const app = require('../../app');
const User = require('../../api/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const user = {
    name: 'test',
    email: 'test@test.com',
    password: 'testZ345test-'
}

const invalidUser = {
    name: 'test',
    email: 'test',
    password: 'testZ345test-'
}

describe('Authentication', () => {
    beforeEach(done => {
        User.remove({}, err => {
            done();
        });
    });
    describe('POST login', () => {
        it('Shouldn\'t sign in user if invalid credentials', done => {
            chai.request(app).
            post('/auth/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                chai.request(app).
                post('/auth/login').
                send({
                    email: invalidUser.email,
                    password: invalidUser.password
                }).
                end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error')
                    res.body.error.should.have.property('message').eql('Invalid credentials');
                    done()
                });
            });
        });
        it('Should sign in user if right credentials', done => {
            chai.request(app).
            post('/auth/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                chai.request(app).
                post('/auth/login').
                send({
                    email: user.email,
                    password: user.password
                }).
                end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    Object.keys(res.body).length.should.eql(2);
                    res.body.should.have.property('message').eql('Auth successful');
                    res.body.should.have.property('token');
                    done()
                });
            });
        });
    });
    describe('POST register', () => {
        it('Shouldn\'t sing up user if invalid credentials', done => {
            chai.request(app).
            post('/auth/register').
            send(invalidUser).
            end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.have.property('message').eql('User validation failed: email: Path `email` is invalid (test).');
                done();
            });
        });
        it('Should sing up user if right credentials', done => {
            chai.request(app).
            post('/auth/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                done();
            });
        });
    });
});