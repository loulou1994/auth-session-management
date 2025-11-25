export interface IUseCase<Input, Output=any> {
    execute: (params: Input) => Output
}