

declare module 'scikit-learn' {
  export class LinearRegression {
      fit(X: number[][], y: number[]): void;
      predict(X: number[][]): number[];
  }
}

export const planifierTaches: (projet: any) => Promise<number[]>;
