export const baseStyles = {
  main: {
    backgroundColor: "#f6f9fc",
    fontFamily:
      "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
  },
  heading: {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0",
  },
  paragraph: {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149",
  },
  link: {
    color: "#2754C5",
    textDecoration: "underline",
  },
  
  buttonStyle : {
  backgroundColor: '#2754C5',
  color: '#ffffff',
  padding: '10px 15px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '10px 0'
},

footerStyle : {
  fontSize: '12px',
  color: '#666666',
  marginTop: '30px'
}

} as const;

export type BaseStyles = typeof baseStyles;