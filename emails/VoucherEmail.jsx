import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const LOGO_URL = 'https://gasperautodetailing.com/logo.png';

// Azul fuerte / eléctrico exacto de tu referencia
const ACCENT_BLUE = '#00b4d8'; 

export default function VoucherEmail({
  clientName = 'Valued Customer',
  clientAddress = 'Not provided',
  vehicleType,
  selectedService = 'Detailing Service',
  selectedDate = 'TBD',
  selectedTime = 'TBD',
  paymentMethod = 'Zelle',
  total = '0.00',
  
}) {
  return (
    <Html>
      <Head />
      <Preview>Booking Confirmation - Gasper Auto Detailing</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Header con Logo y Título */}
          <Section style={header}>
            <Row>
              <Column style={{ width: '60px' }}>
                <Img 
                  src={LOGO_URL} 
                  width="48" 
                  height="48" 
                  alt="Gasper Logo" 
                  style={{ borderRadius: '50%', display: 'block' }} 
                />
              </Column>
              <Column style={{ verticalAlign: 'middle' }}>
                <Heading style={headerTitle}>Gasper</Heading>
                <Text style={headerSubtitle}>AUTO DETAILING</Text>
              </Column>
            </Row>
          </Section>

          {/* Tarjeta de Servicio */}
          <Section style={serviceCard}>
            <Heading style={serviceTitle}>{selectedService}</Heading>
            <Text style={servicePrice}>$ {total}</Text>

            <hr style={divider} />

            <Text style={sectionHeader}>Booking Details:</Text>

            {/* Caja interna oscura con todos los datos */}
            <Section style={innerBox}>
              <table style={tableStyle}>
                <tr>
                  <td style={labelStyle}>Client:</td>
                  <td style={valueStyle}>{clientName}</td>
                </tr>
                <tr>
  <td style={labelStyle}>Address:</td>
  <td style={valueStyle}>{clientAddress}</td>
</tr>
<tr>
  <td style={labelStyle}>Vehicle:</td>
  <td style={valueStyle}>{vehicleType}</td>
</tr>
                <tr>
                  <td style={labelStyle}>Date:</td>
                  <td style={valueStyle}>{selectedDate}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Time:</td>
                  <td style={valueStyle}>{selectedTime}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Payment:</td>
                  <td style={valueStyle}>{paymentMethod}</td>
                </tr>
              </table>
            </Section>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// Estilos
const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#121212",
  border: "1px solid #1f1f1f",
  borderRadius: "16px",
  margin: "0 auto",
  padding: "32px",
  width: "100%",
  maxWidth: "520px",
};

const header = {
  marginBottom: "24px",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  lineHeight: "1",
};

const headerSubtitle = {
  color: ACCENT_BLUE,
  fontSize: "11px",
  fontWeight: "bold",
  letterSpacing: "1.5px",
  margin: "4px 0 0 0",
};

const serviceCard = {
  marginBottom: "10px",
};

const serviceTitle = {
  color: ACCENT_BLUE, 
  fontSize: "26px",
  fontWeight: "bold",
  margin: "0 0 4px 0",
};

const servicePrice = {
  color: ACCENT_BLUE, 
  fontSize: "20px",
  fontWeight: "600",
  margin: "0",
};

const divider = {
  borderColor: "#222222",
  margin: "20px 0",
};

const sectionHeader = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "12px",
  marginTop: "0",
};

const innerBox = {
  backgroundColor: "#0a0a0a",
  border: "1px solid #1f1f1f",
  borderRadius: "12px",
  padding: "20px",
};

const tableStyle = {
  width: "100%",
};

const labelStyle = {
  color: "#888888",
  fontSize: "14px",
  paddingBottom: "10px",
  width: "30%",
};

const valueStyle = {
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  paddingBottom: "10px",
  width: "70%",
};