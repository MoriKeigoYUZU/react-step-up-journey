import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion, AccordionItem } from '../exercises/02-compound-components';

describe('Accordion と AccordionItem', () => {
  it('初期状態では内容が非表示', () => {
    render(
      <Accordion>
        <AccordionItem title="セクション1">内容1</AccordionItem>
      </Accordion>
    );
    expect(screen.queryByText('内容1')).not.toBeInTheDocument();
  });

  it('タイトルをクリックすると内容が表示される', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem title="セクション1">内容1</AccordionItem>
      </Accordion>
    );
    await user.click(screen.getByRole('button', { name: 'セクション1' }));
    expect(screen.getByText('内容1')).toBeInTheDocument();
  });

  it('もう一度クリックすると内容が非表示になる', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem title="セクション1">内容1</AccordionItem>
      </Accordion>
    );
    const button = screen.getByRole('button', { name: 'セクション1' });
    await user.click(button);
    await user.click(button);
    expect(screen.queryByText('内容1')).not.toBeInTheDocument();
  });

  it('複数の AccordionItem が独立して動作する', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem title="セクション1">内容1</AccordionItem>
        <AccordionItem title="セクション2">内容2</AccordionItem>
      </Accordion>
    );
    await user.click(screen.getByRole('button', { name: 'セクション1' }));
    expect(screen.getByText('内容1')).toBeInTheDocument();
    expect(screen.queryByText('内容2')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'セクション2' }));
    expect(screen.getByText('内容1')).toBeInTheDocument();
    expect(screen.getByText('内容2')).toBeInTheDocument();
  });
});
