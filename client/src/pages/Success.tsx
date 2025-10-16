import { Link, useSearchParams } from 'react-router-dom';

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  return (
    <div style={{ maxWidth: 700, margin: '32px auto', textAlign: 'center' }}>
      <h2>Thank you!</h2>
      <p>Your order was placed successfully.</p>
      {sessionId && <p>Session: {sessionId}</p>}
      <Link to="/">Continue shopping</Link>
    </div>
  );
}
