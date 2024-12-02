import { Request, Response } from 'express';
import { HttpStatus } from '~/constants/HttpStatus';
import { CommonMessage, UserMessage } from '~/constants/Message';
import { ApplicationResponse } from '~/models/utils/Response';
import userService from '~/services/user.service';

class UserController {
  /**
   * Retrieve all users.
   * @returns A promise that resolves to the list of users.
   */
  public findAll = async (req: Request, res: Response) => {
    const result = await userService.findAll();
    console.log(result);
    res.json(result);
  };

  /**
   * Register new user.
   * @returns A promise that resolves to the registered user.
   */
  public register = async (req: Request, res: Response) => {
    const data = await userService.register(req.body);
    const response = new ApplicationResponse({
      message: CommonMessage.CREATED,
      detail: UserMessage.CREATED,
      data
    });
    res.status(HttpStatus.CREATED).json(response);
  };

  /**
   * Login  user.
   * @returns A promise that resolves to the logged in user
   */
  public login = async (req: Request, res: Response) => {
    const data = await userService.login(req.body);

    // check result
    if (data?.errors === UserMessage.LOGIN_FAIL) {
      // case login fail
      const response = new ApplicationResponse({
        message: CommonMessage.UNAUTHORIZED,
        errors: data.errors
      });
      res.status(HttpStatus.UNAUTHORIZED).json(response);
    } else {
      // case login success
      const response = new ApplicationResponse({
        message: CommonMessage.SUCCESS,
        detail: UserMessage.LOGIN_SUCCESS,
        data
      });
      res.status(HttpStatus.SUCCESS).json(response);
    }
  };

  /**
   * Refreshes user's token.
   * @returns A promise that resolves to the refreshed token.
   */
  public refreshToken = async (req: Request, res: Response) => {
    const data = await userService.refreshToken(req.authorization);
    const response = new ApplicationResponse({
      message: CommonMessage.SUCCESS,
      detail: UserMessage.REFRESH_TOKEN_SUCCESS,
      data
    });
    res.status(HttpStatus.SUCCESS).json(response);
  };

  /**
   * Logs out.
   * @returns A promise that resolves to a message indicating that the user has been logged out.
   */
  public logout = async (req: Request, res: Response) => {
    await userService.logout(req.authorization);
    const response = new ApplicationResponse({
      message: CommonMessage.SUCCESS,
      detail: UserMessage.LOGOUT_SUCCESS
    });
    res.status(HttpStatus.SUCCESS).json(response);
  };

  /**
   * Verify email.
   * @returns A promise that resolves to the refreshed token.
   */
  public verifyEmail = async (req: Request, res: Response) => {
    const detail = await userService.verifyEmail(req.authorization);
    const response = new ApplicationResponse({
      message: CommonMessage.SUCCESS,
      detail
    });
    res.status(HttpStatus.SUCCESS).json(response);
  };

  /**
   * Refreshes a user's token.
   * @returns A promise that resolves to the refreshed token.
   */
  public resendVerifyEmail = async (req: Request, res: Response) => {
    const detail = await userService.resendVerifyEmail(req.authorization);
    const response = new ApplicationResponse({
      message: CommonMessage.SUCCESS,
      detail
    });
    res.status(HttpStatus.SUCCESS).json(response);
  };
}

const userController = new UserController();
export default userController;
