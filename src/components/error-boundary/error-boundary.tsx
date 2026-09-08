import React, { type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // С помощью этого метода меняем стейт компонента при возникновении ошибки:
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // С помощью этого метода логируем информацию об ошибке:
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.log('Возникла ошибка!', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Если возникла ошибка, сообщаем об этом пользователю в специальном компоненте:
      return (
        <section>
          <h1>Что-то пошло не так :(</h1>
          <p>В приложении произошла ошибка. Пожалуйста, перезагрузите страницу.</p>
        </section>
      );
    }
    // Если всё работает штатно, рендерим дочерние компоненты
    return this.props.children;
  }
}

export default ErrorBoundary;
