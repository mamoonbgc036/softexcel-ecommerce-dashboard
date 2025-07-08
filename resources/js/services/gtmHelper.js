// GTM Helper Functions

/**
 * Pushes event data to the GTM dataLayer
 * @param {Object} eventData - Event data to send
 */
export const pushToDataLayer = (eventData) => {
    if (window.dataLayer) {
        window.dataLayer.length = 0; // Clear old data
        window.dataLayer.push(eventData);
        console.log("DataLayer updated:", window.dataLayer); // Log the new state
    } else {
        console.warn("GTM Data Layer is not initialized.");
    }
};

/**
 * Tracks a Page View
 * @param {string} pagePath - Current page path
 * @param {string} pageTitle - Page title
 */
export const trackViewItem = (product, price) => {
    console.log("Product Data:", product);
    const ecommerceData = {
        event: "view_item",
        ecommerce: {
            currency: "BDT", // You can modify this based on your locale or preferences
            value: price, // Set the value dynamically from the product data
            items: [
                {
                    item_id: product.id,
                    item_name: product.product_name,
                    price: price,
                    item_brand: product.brand ? product.brand : "No Brand", // Assuming you might have a brand property
                    item_category: product.category
                        ? product.category.name
                        : "Uncategorized", // Assuming the category has a name
                    quantity: 1, // You can dynamically set this as needed
                },
            ],
        },
    };

    pushToDataLayer(ecommerceData);
};

/**
 * Tracks User Registration
 * @param {Object} user - User object containing id and email
 */
export const trackUserRegistration = (user) => {
    pushToDataLayer({
        event: "user_registration",
        userId: user.id,
        userEmail: user.email,
    });
};

/**
 * Tracks a Product Click
 * @param {Object} product - Product object with details
 */
export const trackProductClick = (product) => {
    pushToDataLayer({
        event: "product_click",
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        price: product.price,
    });
};

/**
 * Tracks Add to Cart
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (data) => {
    if (!data || !data.product) return;

    pushToDataLayer({
        event: "add_to_cart",
        ecommerce: {
            items: [
                {
                    item_name: data.product.product_name,
                    item_id: data.product.id,
                    price: parseFloat(data.product.price),
                    item_brand: data.product.brand?.name || "No Brand",
                    item_category: data.category || "",
                    item_category2: data.subcategory || "",
                    item_variant: data.selectedAttributes
                        .map(
                            (attr) =>
                                `${attr.attribute_name}: ${attr.attribute_option}`
                        )
                        .join(", "),
                    // item_list_name: "",
                    // item_list_id: "",
                    // index: 0,
                    quantity: data.quantity,
                },
            ],
        },
    });
};

/**
 * Tracks Checkout
 * @param {Array} cartItems - List of products in cart
 * @param {number} totalPrice - Total cart value
 */
export const trackCheckout = (data, totalPrice) => {
    if (!data) return;

    console.log("trackCheckout data:", data);

    const items = Array.isArray(data) ? data : [data]; // Ensure data is always an array

    const gtmData = {
        event: "begin_checkout",
        ecommerce: {
            currency: "BDT",
            value: totalPrice, // Calculate total value
            items: items.map((item) => ({
                item_id: item.product_id || item.product?.id, // Product ID
                item_name: item.product?.product_name || "Unknown Product", // Product Name
                price: parseFloat(item.final_price.replace(/,/g, "") || 0), // Use final_price with comma removal
                quantity: item.quantity || 1, // Product Quantity
                variant: item.attributes
                    ? item.attributes
                          .map(
                              (attr) =>
                                  `${attr.attribute_name}: ${attr.attribute_option}`
                          )
                          .join(", ")
                    : "", // Format attribute variants
            })),
        },
        custom_data: {
            selected_attributes: items.flatMap((item) =>
                item.attributes
                    ? item.attributes.map((attr) => ({
                          attribute_id: attr.attribute_id || null,
                          attribute_option_id: attr.attribute_option_id || null,
                          attribute_name: attr.attribute_name || "",
                          attribute_option: attr.attribute_option || "",
                          attribute_option_price: attr.price || "0.00",
                          id: attr.product_attr_id || null,
                      }))
                    : []
            ),
            campaign_id: items[0]?.campaign_id || null, // Campaign ID if available
            discount_value: items[0]?.discount_value || null, // Discount value if available
        },
    };

    //console.log("GTAG Data:", gtmData);

    // Push the GTM data
    pushToDataLayer(gtmData);
};

export const trackDiractCheckout = (data) => {
    if (!data) return;

    const gtmData = {
        event: "begin_checkout",
        ecommerce: {
            currency: "BDT",
            value: parseFloat(data.totalPrice),
            items: [
                {
                    item_id: data.product_id, // Product ID
                    item_name: data.product_name, // Product Name
                    price: parseFloat(data.price), // Convert to number
                    item_brand: data.brand?.name || "No Brand",
                    item_category: data.category || "",
                    item_category2: data.subcategory || "",
                    item_variant: data.selectedAttributes
                        .map(
                            (attr) =>
                                `${attr.attribute_name}: ${attr.attribute_option}`
                        )
                        .join(", "), // Format attribute variants
                    quantity: data.quantity, // Product Quantity
                    free_delivery: data.free_delivery ? "Yes" : "No", // Convert to readable format
                },
            ],
        },
        custom_data: {
            selected_attributes: data.selectedAttributes
                ? data.selectedAttributes.map((attr) => ({
                      attribute_id: attr.attribute_id || null,
                      attribute_option_id: attr.attribute_option_id || null,
                      attribute_name: attr.attribute_name || "",
                      attribute_option: attr.attribute_option || "",
                      attribute_option_price:
                          attr.attribute_option_price || "0.00",
                      id: attr.product_attr_id || null,
                  }))
                : [],
            category: data.category || "",
            free_delivery: data.free_delivery ? "Yes" : "No",
            total_price: parseFloat(data.totalPrice) || 0,
        },
    };

    console.log("GTAG Direct Checkout Data:", gtmData);

    pushToDataLayer(gtmData);
};

/**
 * Tracks Purchase
 * @param {Object} order - Order object containing details
 */
export const trackPurchase = (order) => {
    if (!order || !order.items) return;

    // Prepare the event data based on the provided JSON structure
    const gtmData = {
        event: "purchase",
        ecommerce: {
            transaction_id: order.invoice_number || `T_${Date.now()}`, // Use invoice number or generate one
            currency: "BDT", // Assuming BDT as the currency
            value: parseFloat(order.total_price) || 0, // Total value of the order
            shipping: parseFloat(order.delivery_charge) || 0, // Shipping cost
            tax: parseFloat(order.tax) || 0, // Dynamic tax value
            items: order.items.map((item) => ({
                item_id: item.product.id, // Product ID
                item_name: item.product.product_name || "Unknown Product", // Product name
                price: parseFloat(item.individual_price), // Individual price of the item
                quantity: item.quantity, // Product Quantity
                variant: item.attributeOptionId // Assuming attributeOptionId represents the product variant
                    ? item.attributeOptionId
                          .split(",")
                          .map((id) => `Option: ${id}`)
                          .join(", ")
                    : "",
                product_code: item.product.product_code || "No Code", // Product code
                total: parseFloat(item.total), // Total cost for this item
                campaign_discount: parseFloat(item.campaign_discount) || 0, // Campaign discount, if any
                coupon_discount: parseFloat(item.coupon_discount) || 0, // Coupon discount, if any
                original_price: parseFloat(item.original_price) || 0, // Original price of the product
            })),
        },

        //   payment_method: order.payment_method || "cash", // Payment method (defaults to cash if missing)
        //   shipping_method: order.shipping_method || "", // Shipping method
        //   discount_applied: parseFloat(order.discount) || 0, // Applied discount
        //   coupon_code: order.coupon_code || "", // Coupon code used
        //   delivery_charge: parseFloat(order.delivery_charge) || 0, // Delivery charge
        //   order_details: {
        //     paid_amount: parseFloat(order.paid_amount) || 0, // Paid amount for the order
        //     remaining_balance: parseFloat(order.remaining_balance) || 0, // Remaining balance
        //     order_type: order.order_type || "pos", // Order type (POS or others)
        //     order_status: order.order_status || "pending", // Order status
        //     delivery: order.delivery || "N/A", // Delivery status or method
        //   },
        customer_details: {
            user_identifier: order.user_identifier || "", // Customer user identifier
            name: order.customer_name || "", // Customer name
            address: order.address || "", // Customer address
            phone_number: order.phone_number || "", // Customer phone number
            email: order.email || "", // Customer email
            select_area: order.select_area || "", // Customer area
            note: order.note || "", // Additional customer note
        },
    };

    console.log("GTM Purchase Data:", gtmData);

    pushToDataLayer(gtmData); // Send the data to the data layer
};
