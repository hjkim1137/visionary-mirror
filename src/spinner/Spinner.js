import logo from './Spinner-logo.svg';
import './Spinner.css';

function Spinner() {
  return (
    <div className="Spinner">
      <header className="Spinner-header">
        <img src={logo} className="Spinner-logo" alt="logo" />
        <p>
          Loading...
        </p>
      </header>
    </div>
  );
}

export default Spinner;

//index.js에서
root.render(
  <React.StrictMode>
    <Spinner />
  </React.StrictMode>
);