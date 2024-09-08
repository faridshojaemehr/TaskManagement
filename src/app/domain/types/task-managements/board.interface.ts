interface IGeneral {
  value: string;
  viewValue: string;
}
export interface IBoard extends IGeneral {}
export interface IUser extends IGeneral {}
export interface IPriority extends IGeneral {}
export interface IStatus extends IGeneral {}
