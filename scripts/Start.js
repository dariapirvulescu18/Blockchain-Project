const { spawn } = require('child_process');
const path = require('path');

// Use cross-platform npx path
const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// Kill process on port 8545 if it exists
const killPort = spawn(npxCommand, ['kill-port', '8545'], {
    shell: true
});

killPort.on('close', (code) => {
    // Start Hardhat node
    const hardhatNode = spawn(npxCommand, ['hardhat', 'node'], {
        stdio: 'inherit',
        shell: true
    });

    // Wait a bit for the node to start
    setTimeout(() => {
        // Deploy contracts
        const deploy = spawn(npxCommand, ['hardhat', 'run', 'scripts/Deploy.js', '--network', 'localhost'], {
            stdio: 'inherit',
            shell: true
        });

        deploy.on('close', (code) => {
            // Start React app
            const reactApp = spawn(npxCommand, ['react-scripts', 'start'], {
                stdio: 'inherit',
                shell: true
            });
        });
    }, 5000);
});