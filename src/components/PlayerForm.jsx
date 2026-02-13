import { useState } from 'react';
import { validateName, validateContact, validateAge } from '../utils/validation';
import { useGame } from '../context/GameContext';
import { MAX_PLAYERS } from '../constants';

export default function PlayerForm() {
  const { addPlayer, counter, locationId } = useGame();
  const [form, setForm] = useState({ name: '', contact: '', age: '' });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const limitReached = counter >= MAX_PLAYERS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setSuccessMsg('');
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    const nameResult = validateName(form.name);
    const contactResult = validateContact(form.contact);
    const ageResult = validateAge(form.age);

    if (!nameResult.valid || !contactResult.valid || !ageResult.valid) {
      setErrors({
        name: nameResult.error,
        contact: contactResult.error,
        age: ageResult.error,
      });
      return;
    }

    const playerData = {
      playerNumber: counter + 1,
      name: form.name.trim(),
      contact: form.contact.trim(),
      age: Number(form.age),
    };

    setSubmitting(true);
    const result = await addPlayer(playerData);
    setSubmitting(false);

    if (result.success) {
      setForm({ name: '', contact: '', age: '' });
      setErrors({});
      setSuccessMsg(`Player #${playerData.playerNumber} "${playerData.name}" registered!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrors({ form: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Register New Player</h3>

      {limitReached && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
          Maximum {MAX_PLAYERS} players reached for today. Generate a PDF report and reset to continue.
        </div>
      )}

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {errors.form}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={limitReached}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <input
            type="tel"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            disabled={limitReached}
            placeholder="0771234567"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            disabled={limitReached}
            placeholder="25"
            min="5"
            max="99"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={limitReached || submitting}
        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {submitting ? 'Registering…' : `Register Player (${counter}/${MAX_PLAYERS})`}
      </button>
    </form>
  );
}
