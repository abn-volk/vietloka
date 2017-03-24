import { VietlokaPage } from './app.po';

describe('vietloka App', () => {
  let page: VietlokaPage;

  beforeEach(() => {
    page = new VietlokaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
