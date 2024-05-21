import jwt

# Load the public key
with open("public.pem", "r") as f:
    public_key = f.read()

# JWT token to decode
token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJGU0FEIiwidXNlcm5hbWUiOiJBbWl0IFNvbGFua2kiLCJ1c2VySUQiOiIyMDIzU0w5MzEwMiIsImV4cCI6MTcxNjMwMjYyNX0.eDPZpsWIQO3K3ZL69quxI2OojLwZo6jwDpD24AxoD4cCJC1anPQ7K8BU8Y3AFRIMsqkeZPS3BgpQIxyn3iiqBYDx83fHc-tG91Ttop8uC0Quq6T4OckGhjYBeybrypY-QSrza6BhOVam4sxpYA33iHzirnGZfrw40z03J8_al4oAUyUdtmywH7UHMC7VGRdx32pU9ce6PhBa4FoKTCjl1yykOZYWT6d2B8duVE10uli3EbTPyohf6ZH9IAMD-R0479UC95UjsDKsI18-_9rxbFgwJ7ynKe71JDMBsz1JO0lrCqwGYDTZXWQOe33LJuKJBvRywSXA10EoEsCQVWRgjQ"

# Decode and verify the token
decoded_token = jwt.decode(token, public_key, algorithms=["RS256"])

print(decoded_token)