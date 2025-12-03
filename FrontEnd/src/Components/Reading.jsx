import '../Styles/Reading.css';
import { useSelector, useDispatch } from 'react-redux';
import { update } from '../Store';
import { useState, useEffect } from 'react';
import { MdLocalGasStation } from 'react-icons/md';
import { FaPlay, FaStop } from 'react-icons/fa';

function ReadingForm() {
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.billing);

  // Initialize readings from localStorage
  const [readings, setReadings] = useState(() => {
    const saved = localStorage.getItem('pumpReadings');
    return saved
      ? JSON.parse(saved)
      : {
        Ba1: '',
        Ba2: '',
        Bb1: '',
        Bb2: '',
        Aa1: '',
        Aa2: '',
        Ab1: '',
        Ab2: ''
      };
  });

  // Initialize toggles from localStorage
  const [isB1On, setIsB1On] = useState(() => JSON.parse(localStorage.getItem('isB1Diesel')) || false);
  const [isB2On, setIsB2On] = useState(() => JSON.parse(localStorage.getItem('isB2Diesel')) || false);
  const [isA2Power, setIsA2Power] = useState(() => JSON.parse(localStorage.getItem('isA2Power')) || false);

  // Persist readings to localStorage
  useEffect(() => {
    localStorage.setItem('pumpReadings', JSON.stringify(readings));
  }, [readings]);

  // Persist toggle states
  useEffect(() => {
    localStorage.setItem('isB1Diesel', JSON.stringify(isB1On));
    dispatch(update({ isB1Diesel: isB1On }));
  }, [isB1On, dispatch]);

  useEffect(() => {
    localStorage.setItem('isB2Diesel', JSON.stringify(isB2On));
    dispatch(update({ isB2Diesel: isB2On }));
  }, [isB2On, dispatch]);

  useEffect(() => {
    localStorage.setItem('isA2Power', JSON.stringify(isA2Power));
    dispatch(update({ isA2Power }));
  }, [isA2Power, dispatch]);

  // Clear all event listener
  useEffect(() => {
    const handleClearAll = () => {
      setReadings({
        Ba1: '',
        Ba2: '',
        Bb1: '',
        Bb2: '',
        Aa1: '',
        Aa2: '',
        Ab1: '',
        Ab2: ''
      });
      setIsB1On(false);
      setIsB2On(false);
      setIsA2Power(false);
    };

    window.addEventListener('clearAllData', handleClearAll);
    return () => window.removeEventListener('clearAllData', handleClearAll);
  }, []);

  // Handle numeric input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    const numericValue = Number(value);

    setReadings(prev => ({ ...prev, [id]: value }));
    dispatch(update({ [id]: numericValue }));
  };

  // Toggle handlers
  const toggleB1 = () => setIsB1On(prev => !prev);
  const toggleB2 = () => setIsB2On(prev => !prev);
  const toggleA2Power = () => setIsA2Power(prev => !prev);

  return (
    <div className="container">

      {/* PUMP A1 */}
      <div className="reading-section pump-a1">
        <p><MdLocalGasStation className="section-icon" /> Pump A1</p>
        <div className="readings">
          <label htmlFor="Ba1"><FaPlay className="pump-icon" /> Start:</label>
          <input
            id="Ba1"
            type="number"
            value={readings.Ba1 || payment.Ba1 || ''}
            onChange={handleChange}
            placeholder="Start Reading"
          />

          <label htmlFor="Aa1"><FaStop className="pump-icon" /> End:</label>
          <input
            id="Aa1"
            type="number"
            value={readings.Aa1 || payment.Aa1 || ''}
            onChange={handleChange}
            placeholder="End Reading"
          />
        </div>
      </div>

      {/* PUMP A2 */}
      <div className="reading-section pump-a2">
        <div className="bluetooth-toggle-container">
          <span className={`bluetooth-status ${isA2Power ? 'active' : ''}`}>
            {isA2Power ? "Power" : "Petrol"}
          </span>
          <button className={`bluetooth-toggle ${isA2Power ? 'on' : 'off'}`} onClick={toggleA2Power}>
            <span className="toggle-slider"></span>
          </button>
        </div>
        <p><MdLocalGasStation className="section-icon" /> Pump A2</p>
        <div className="readings">
          <label htmlFor="Ba2"><FaPlay className="pump-icon" /> Start:</label>
          <input
            id="Ba2"
            type="number"
            value={readings.Ba2 || payment.Ba2 || ''}
            onChange={handleChange}
            placeholder="Start Reading"
          />

          <label htmlFor="Aa2"><FaStop className="pump-icon" /> End:</label>
          <input
            id="Aa2"
            type="number"
            value={readings.Aa2 || payment.Aa2 || ''}
            onChange={handleChange}
            placeholder="End Reading"
          />
        </div>
      </div>

      {/* PUMP B1 */}
      <div className="reading-section pump-b1">
        <div className="bluetooth-toggle-container">
          <span className={`bluetooth-status ${isB1On ? 'active' : ''}`}>
            {isB1On ? "Diesel" : "Petrol"}
          </span>
          <button className={`bluetooth-toggle ${isB1On ? 'on' : 'off'}`} onClick={toggleB1} >
            <span className="toggle-slider"></span>
          </button>
        </div>
        <p><MdLocalGasStation className="section-icon" /> Pump B1</p>
        <div className="readings">
          <label htmlFor="Bb1"><FaPlay className="pump-icon" /> Start:</label>
          <input
            id="Bb1"
            type="number"
            value={readings.Bb1 || payment.Bb1 || ''}
            onChange={handleChange}
            placeholder="Start Reading"
          />

          <label htmlFor="Ab1"><FaStop className="pump-icon" /> End:</label>
          <input
            id="Ab1"
            type="number"
            value={readings.Ab1 || payment.Ab1 || ''}
            onChange={handleChange}
            placeholder="End Reading"
          />
        </div>
      </div>

      {/* PUMP B2 */}
      <div className="reading-section pump-b2">
        <div className="bluetooth-toggle-container">
          <span className={`bluetooth-status ${isB2On ? 'active' : ''}`}>
            {isB2On ? "Diesel" : "Petrol"}
          </span>
          <button className={`bluetooth-toggle ${isB2On ? 'on' : 'off'}`} onClick={toggleB2}>
            <span className="toggle-slider"></span>
          </button>
        </div>
        <p><MdLocalGasStation className="section-icon" /> Pump B2</p>
        <div className="readings">
          <label htmlFor="Bb2"><FaPlay className="pump-icon" /> Start:</label>
          <input
            id="Bb2"
            type="number"
            value={readings.Bb2 || payment.Bb2 || ''}
            onChange={handleChange}
            placeholder="Start Reading"
          />

          <label htmlFor="Ab2"><FaStop className="pump-icon" /> End:</label>
          <input
            id="Ab2"
            type="number"
            value={readings.Ab2 || payment.Ab2 || ''}
            onChange={handleChange}
            placeholder="End Reading"
          />
        </div>
      </div>

    </div>
  );
}

export default ReadingForm;
