import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const GlassCard = ({ title, content, footer, buttons }) => {
  const navigate = useNavigate();

  const cardStyle = {
    backdropFilter: 'blur(2px)',
    backgroundColor: 'rgba(175, 175, 175, 0.1)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <Card style={cardStyle} className="border-0 rounded w-100 h-100 text-white">
      <Card.Body className="w-100 h-100">
        <Card.Title className="fs-3 fw-bold">{title}</Card.Title>
        <div className="d-flex flex-column flex-sm-row fs-6 justify-content-between p-0 h-100 w-100">
          {content}
        </div>
        <div className="d-flex flex-wrap justify-content-center gap-2 mt-auto w-100">
          {buttons &&
            buttons.map((button, index) => (
              <Button
                key={index}
                variant="primary"
                className="px-4 py-2 fw-semibold"
                onClick={() => navigate(button.endpoint)}
              >
                {button.name}
              </Button>
            ))}
        </div>
      </Card.Body>
    </Card>
  );
};


export default GlassCard;
