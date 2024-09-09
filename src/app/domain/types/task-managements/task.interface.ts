export interface ITasks {
  name: string;
  tasksColumns: TasksColumn[];
}

export interface TasksColumn {
  id: string;
  name: string;
  tasks: ITask[];
}

export interface ITask {
  id: number | null;
  title: string | null;
  desc: string | null;
  priority: string | null;
  projectname: string | null;
  assignedTo: string | null;
  status: string | null;
}
