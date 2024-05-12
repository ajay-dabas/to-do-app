const getEnvVar = (name: string, defaultValue?: string) => {
  const value = process.env[name];
  if (value == null) {
    if (defaultValue != null) {
      return defaultValue;
    }
    throw new Error(`${name} env variable value not provided`);
  }
  return value;
};

export { getEnvVar };
