import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="text-center p-8 bg-gray-900 rounded-2xl max-w-md">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-white text-2xl font-bold mb-2">Something went wrong!</h2>
            <p className="text-gray-400 mb-6 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
