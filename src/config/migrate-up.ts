import { migrator } from "./migrator.js"

try {

    await migrator.up()
    console.log('Migrations executed successfully.')
} catch (error) {
    console.error('Error running migrations:', error)
    process.exit(1)
}
