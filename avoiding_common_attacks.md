# Avoiding common attacks

## Rationale

Generally this contract has less risk as it is does not hold funds and avoids payable functions, but there are still possible attacks to destroy or inhibit the contracts.

## Denial of Service with Failed Call (SWC-113)

Avoiding having the possibility of a contract address from breaking the GameCreator through not baking in existing addresses into any key contract functionality.

## Denial of Service by Block Gas Limit or startGas (SWC-128)

Using mappings wwhere possible, and limiting the number of participants to under 4 prevents the contract functions from becoming too expensive to run.
Limiting the number of participants to under 4 prevents the function from running out of gas.
