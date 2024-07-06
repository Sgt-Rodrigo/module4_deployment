import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service";



describe('UsersController', ()=>{
    //w creates testing environment for controller
    let usersController:UsersController;

    //w mock service dependency
    let mockUsersService: Partial<UsersService>


    beforeEach(async ()=> {
         //w creates testing environment for controller
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {provide: UsersService, useValue: mockUsersService}
            ]
        }).compile();

        usersController = module.get<UsersController>(UsersController)
    })

    //* Tests

    xit('users controller should be defined', ()=> {
        expect(usersController).toBeDefined();
    })
})