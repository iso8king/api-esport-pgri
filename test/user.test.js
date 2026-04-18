import supertest from "supertest";
import { web } from "../src/application/web.js";

describe('POST /api/users/register' , ()=> {
    it('should create user in db', async()=>{
        const result = await supertest(web).post('/api/users/register').send({
            username : "iso8king",
            password : "123456789",
            nama : "Ridho Firduas",
            game_id : '2320120301022',
            server_id : "2126"
        })
        
        expect(result.body.data.username).toBe("iso8king");
        expect(result.body.data.role).toBe("user")
    })
})
