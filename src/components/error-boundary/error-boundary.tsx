import { Button } from '@krgaa/react-developer-burger-ui-components';
import React, { type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  // Сбрасываем ошибку и заново рендерим дочерние компоненты
  handleReset = (): void => {
    this.setState({ error: null });
  };

  // С помощью этого метода логируем информацию об ошибке:
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.log('Возникла ошибка!', error, info);
  }

  render(): ReactNode {
    const { error } = this.state;
    if (error) {
      // Если возникла ошибка, сообщаем об этом пользователю в специальном компоненте:
      return (
        <section className="pl-5">
          <h2 className="text text_type_main-medium">Что-то пошло не так :(</h2>
          <p className="text text_type_main-default text_color_error mt-4">
            {error.message}
          </p>
          <Button
            htmlType="button"
            type="primary"
            size="medium"
            extraClass="mt-6"
            onClick={this.handleReset}
          >
            Попробовать снова
          </Button>
        </section>
      );
    }
    // Если всё работает штатно, рендерим дочерние компоненты
    return this.props.children;
  }
}

export default ErrorBoundary;
