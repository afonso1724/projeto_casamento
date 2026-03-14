import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    const { error, info } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-stone-50">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-red-200 p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ocorreu um erro inesperado.</h1>
          <p className="text-sm text-gray-700 mb-4">Veja os detalhes abaixo para identificar o problema.</p>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 overflow-auto max-h-96">
            <pre className="text-xs text-red-900 whitespace-pre-wrap">
              {String(error && error.toString())}
              {info?.componentStack ? `\n\nComponent stack:\n${info.componentStack}` : ''}
            </pre>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Você pode tentar recarregar a página ou voltar para a <a className="text-blue-600 underline" href="/">home</a>.
          </p>
        </div>
      </div>
    );
  }
}
