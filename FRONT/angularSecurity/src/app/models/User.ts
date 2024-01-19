export class User {

  public id!: number;
  public roles: string[] = [];
  constructor(public  lastname:string, public  firstname:string, public password:string, public email:string){
  }


}