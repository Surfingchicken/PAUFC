import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../../styles/home.css';
import Modal from './Modal'; 
import logo from "../../img/header/favicon.svg.png";

const stripePromise = loadStripe('pk_test_51PdZ5OJR2hyal4ZRgFsePEuUdfqPYa0D6RhfbwzAj1h0RmnItT51bQwwUq4LNb8KrojF1NoiZeHJqJZOYBfTOz7S003JkbkRp6');

const ContributionsForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState<number>(50);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [streetName, setStreetName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrors([]);
        setErrorMessage(null);

        const newErrors: string[] = [];

        if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(name)) newErrors.push('Le nom ne doit contenir que des lettres, des espaces, des tirets ou des apostrophes.');
        if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(surname)) newErrors.push('Le prénom ne doit contenir que des lettres, des espaces, des tirets ou des apostrophes.');
        if (!/^[A-Za-zÀ-ÿ\s'-]+$/.test(city)) newErrors.push('La ville ne doit contenir que des lettres, des espaces, des tirets ou des apostrophes.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.push('L\'email n\'est pas valide.');
        if (!/^\d{5}$/.test(postalCode)) newErrors.push('Le code postal doit contenir exactement 5 chiffres.');

        setErrors(newErrors);

        if (newErrors.length > 0) {
            setLoading(false);
            setModalMessage(newErrors.join('\n'));
            return;
        }

        if (!stripe || !elements) {
            setErrorMessage('Stripe n\'est pas correctement configuré.');
            setLoading(false);
            setModalMessage('Stripe n\'est pas correctement configuré.');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setErrorMessage('Élément de carte introuvable.');
            setLoading(false);
            setModalMessage('Élément de carte introuvable.');
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name + " " + surname,
                email: email,
                address: {
                    line1: `${streetNumber} ${streetName}`,
                    postal_code: postalCode,
                    city: city,
                    country: 'FR',
                },
            },
        });

        if (error) {
            setErrorMessage('Erreur de création de méthode de paiement : ' + error.message);
            setLoading(false);
            setModalMessage('Erreur de création de méthode de paiement : ' + error.message);
            return;
        }

        if (paymentMethod) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/contributions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        amount: amount,
                        paymentMethodId: paymentMethod.id,
                    }),
                });

                const paymentResult = await response.json();
                if (paymentResult.error) {
                    setModalMessage('Erreur lors de la création de l\'intention de paiement : ' + paymentResult.error);
                } else {
                    setModalMessage('Paiement réussi !');
                    window.location.reload();
                    
                }
            } catch (fetchError) {
                setModalMessage('Erreur lors de la requête de paiement');
            }
        }

        setLoading(false);
    };

    const handleAmountClick = (selectedAmount: number) => {
        setAmount(selectedAmount);
    };

    const closeModal = () => {
        setModalMessage(null);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="donation-form">
                <div className="info-section">
                    <label>
                        Nom
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </label>
                    <label>
                        Prénom
                        <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                    </label>
                    <label>
                        Email
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Numéro de rue
                        <input type="text" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} required />
                    </label>
                    <label>
                        Nom de la voie
                        <input type="text" value={streetName} onChange={(e) => setStreetName(e.target.value)} required />
                    </label>
                    <label>
                        Code Postal
                        <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                    </label>
                    <label>
                        Ville
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </label>
                </div>
                <div className="payment-section">
                    <CardElement />
                </div>
                <button type="submit" disabled={!stripe || !amount || loading}>
                    {loading ? 'Chargement...' : `Contribuer à hauteur de 50€`}
                </button>
            </form>
            {modalMessage && (
                <Modal message={modalMessage} onClose={closeModal} />
            )}
        </>
    );
};

const Contributions: React.FC = () => {
    return (
        <Elements stripe={stripePromise}>
            <div className="donation-container">
                <h1>Contribution annuelle</h1>
                <ContributionsForm />
            </div>
        </Elements>
    );
};

export default Contributions;
