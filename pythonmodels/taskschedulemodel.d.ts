declare module 'python-shell' {
    // Déclarations de types pour le module python-shell
    interface TaskScheduleModel {
      train(X_train: any[], y_train: any[]): void;
      predict(X_new: any[]): any[];
    }
  
    export const TaskScheduleModel: {
      new (): TaskScheduleModel;
    };
}
