import Customer from "@/models/Customer";

// PUT request to update an existing customer by ID
export async function PUT(request, { params }) {
    const { id } = params;
    try {
        const body = await request.json();
        const updatedCustomer = await Customer.findByIdAndUpdate(id, body, { new: true });
        if (!updatedCustomer) {
            return new Response(JSON.stringify({ message: 'Customer not found' }), { status: 404 });
        }
        return new Response(JSON.stringify(updatedCustomer), { status: 200 });
    } catch (error) {
        console.error('Error updating customer:', error);
        return new Response(JSON.stringify({ message: 'Error updating customer' }), { status: 500 });
    }
}

// DELETE request to delete a customer by ID
export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return new Response(JSON.stringify({ message: 'Customer not found' }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: 'Customer deleted' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return new Response(JSON.stringify({ message: 'Error deleting customer' }), { status: 500 });
    }
}
