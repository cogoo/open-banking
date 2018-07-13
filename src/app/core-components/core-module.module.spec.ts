import { CoreModule } from './core-module.module';

describe('CoreModuleModule', () => {
  let coreModuleModule: CoreModule;

  beforeEach(() => {
    coreModuleModule = new CoreModule();
  });

  it('should create an instance', () => {
    expect(coreModuleModule).toBeTruthy();
  });
});
