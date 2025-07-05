const clientService = require("../services/clients.service");
const {
  validateEmail,
  validatePhoneNumber,
  isPositiveInt,
} = require("../utils/helpers");

const ALLOWED_STATUSES = ["CLIENT", "PROSPECT"];

async function getAllClients(request, reply) {
  try {
    console.log("🎯 [Backend] GET /api/clients - Fetching all clients");
    console.log("👤 [Backend] Requested by user:", {
      id: request.user?.id,
      email: request.user?.email,
      role: request.user?.role
    });

    const startTime = Date.now();
    const clients = await clientService.findAllClients(request.user);
    const endTime = Date.now();

    console.log(`⏱️ [Backend] Database query took ${endTime - startTime}ms`);
    console.log("📊 [Backend] Clients fetched successfully");
    console.log("📊 [Backend] Total clients count:", clients.length);
    console.log("=" .repeat(80));
    console.log("📋 [Backend] DETAILED CLIENT DATABASE CONTENT:");
    console.log("=" .repeat(80));

    clients.forEach((client, index) => {
      console.log(`\n👤 [Client ${index + 1}] ==========================================`);
      console.log(`   ID: ${client.id}`);
      console.log(`   First Name: ${client.firstName || 'N/A'}`);
      console.log(`   Last Name: ${client.lastName || 'N/A'}`);
      console.log(`   Full Name: ${client.name || 'N/A'}`);
      console.log(`   Email: ${client.email || 'N/A'}`);
      console.log(`   Phone: ${client.phoneNumber || 'N/A'}`);
      console.log(`   WhatsApp: ${client.whatsappNumber || 'N/A'}`);
      console.log(`   Status: ${client.status || 'N/A'}`);
      console.log(`   Provenance: ${client.provenance || 'N/A'}`);
      console.log(`   Notes: ${client.notes || 'N/A'}`);
      console.log(`   Created At: ${client.createdAt || 'N/A'}`);
      console.log(`   Updated At: ${client.updatedAt || 'N/A'}`);
      console.log(`   Created By ID: ${client.createdById || 'N/A'}`);
      console.log(`   User ID: ${client.userId || 'N/A'}`);

      // Created by details
      if (client.createdBy) {
        console.log(`   👨‍💼 Created By:`);
        console.log(`      ID: ${client.createdBy.id}`);
        console.log(`      Name: ${client.createdBy.name || 'N/A'}`);
        console.log(`      Email: ${client.createdBy.email || 'N/A'}`);
      } else {
        console.log(`   👨‍💼 Created By: Not available`);
      }

      // User account details (if linked)
      if (client.user) {
        console.log(`   🔐 User Account Details:`);
        console.log(`      User ID: ${client.user.id}`);
        console.log(`      User Name: ${client.user.name || 'N/A'}`);
        console.log(`      User Email: ${client.user.email || 'N/A'}`);
        console.log(`      User Role: ${client.user.role || 'N/A'}`);
        console.log(`      User Status: ${client.user.status || 'N/A'}`);
      } else {
        console.log(`   🔐 User Account: Not linked`);
      }

      // Interested apartments
      if (client.interestedApartments && client.interestedApartments.length > 0) {
        console.log(`   🏠 Interested Apartments (${client.interestedApartments.length}):`);
        client.interestedApartments.forEach((apt, aptIndex) => {
          console.log(`      [${aptIndex + 1}] Apartment ID: ${apt.id}`);
          console.log(`          Number: ${apt.number || 'N/A'}`);
          console.log(`          Type: ${apt.type || 'N/A'}`);
          console.log(`          Area: ${apt.area || 'N/A'}m²`);
          console.log(`          Price: ${apt.price ? apt.price.toLocaleString() + '€' : 'N/A'}`);
          console.log(`          Status: ${apt.status || 'N/A'}`);
          console.log(`          Floor: ${apt.floor || 'N/A'}`);
          if (apt.project) {
            console.log(`          Project: ${apt.project.name} (ID: ${apt.project.id})`);
          }
        });
      } else {
        console.log(`   🏠 Interested Apartments: None`);
      }

      // Reserved apartments
      if (client.apartments && client.apartments.length > 0) {
        console.log(`   🔒 Reserved Apartments (${client.apartments.length}):`);
        client.apartments.forEach((apt, aptIndex) => {
          console.log(`      [${aptIndex + 1}] Apartment ID: ${apt.id}`);
          console.log(`          Number: ${apt.number || 'N/A'}`);
          console.log(`          Type: ${apt.type || 'N/A'}`);
          console.log(`          Area: ${apt.area || 'N/A'}m²`);
          console.log(`          Price: ${apt.price ? apt.price.toLocaleString() + '€' : 'N/A'}`);
          console.log(`          Status: ${apt.status || 'N/A'}`);
          console.log(`          Floor: ${apt.floor || 'N/A'}`);
          if (apt.project) {
            console.log(`          Project: ${apt.project.name}`);
          }
        });
      } else {
        console.log(`   🔒 Reserved Apartments: None`);
      }

      console.log(`   ================================================`);
    });

    console.log("=" .repeat(80));
    console.log("📊 [Backend] Client database summary:");
    console.log(`   Total clients: ${clients.length}`);
    console.log(`   PROSPECT clients: ${clients.filter(c => c.status === 'PROSPECT').length}`);
    console.log(`   CLIENT clients: ${clients.filter(c => c.status === 'CLIENT').length}`);
    console.log(`   Clients with user accounts: ${clients.filter(c => c.user).length}`);
    console.log(`   Clients with interested apartments: ${clients.filter(c => c.interestedApartments && c.interestedApartments.length > 0).length}`);
    console.log(`   Clients with reserved apartments: ${clients.filter(c => c.apartments && c.apartments.length > 0).length}`);
    console.log("=" .repeat(80));

    return reply.send(clients);
  } catch (err) {
    console.error("💥 [Backend] Error in getAllClients:", err);
    console.error("💥 [Backend] Error stack:", err.stack);
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function getClientById(request, reply) {
  try {
    const clientId = parseInt(request.params.clientId, 10);
    if (!isPositiveInt(clientId)) {
      return reply
        .code(400)
        .send({ error: "clientId must be a positive integer" });
    }

    const client = await clientService.findClientById(clientId, request.user);
    return reply.send(client);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function createClient(request, reply) {
  try {
    console.log("🎯 [Backend] POST /api/clients - Client creation started");
    console.log("👤 [Backend] User:", { id: request.user?.id, email: request.user?.email, role: request.user?.role });
    console.log("📋 [Backend] Request body:", request.body);
    console.log("📁 [Backend] Request files:", request.files ? Object.keys(request.files) : "No files");

    const { firstName, lastName, name, email, phoneNumber, whatsappNumber, status, notes, provenance, apartmentId, password } = request.body;

    console.log("🔍 [Backend] Extracted fields:", {
      firstName, lastName, name, email, phoneNumber, whatsappNumber, status, notes, provenance, apartmentId, password: password ? "[REDACTED]" : undefined
    });

    // Validate required fields
    if (typeof firstName !== "string" || firstName.trim() === "") {
      console.log("❌ [Backend] Validation failed: First name is required");
      return reply
        .code(400)
        .send({ error: "firstName is required and must be a non-empty string" });
    }

    if (typeof lastName !== "string" || lastName.trim() === "") {
      console.log("❌ [Backend] Validation failed: Last name is required");
      return reply
        .code(400)
        .send({ error: "lastName is required and must be a non-empty string" });
    }
    if (!validateEmail(email)) {
      console.log("❌ [Backend] Validation failed: Invalid email format");
      return reply.code(400).send({ error: "Valid email is required" });
    }
    if (!validatePhoneNumber(phoneNumber)) {
      console.log("❌ [Backend] Validation failed: Invalid phone number format");
      return reply.code(400).send({ error: "Valid phoneNumber is required" });
    }

    // Validate WhatsApp number if provided
    if (whatsappNumber !== undefined && whatsappNumber !== null && whatsappNumber !== "") {
      if (!validatePhoneNumber(whatsappNumber)) {
        console.log("❌ [Backend] Validation failed: Invalid WhatsApp number format");
        return reply.code(400).send({ error: "Valid whatsappNumber format is required" });
      }
    }

    if (provenance !== undefined && typeof provenance !== "string") {
      console.log("❌ [Backend] Validation failed: Invalid provenance type");
      return reply
        .code(400)
        .send({ error: "provenance must be a string" });
    }

    let clientStatus = "PROSPECT";
    if (status !== undefined) {
      console.log("🔍 [Backend] Status received:", status, "Type:", typeof status, "Value:", JSON.stringify(status));
      console.log("🔍 [Backend] Allowed statuses:", ALLOWED_STATUSES);
      console.log("🔍 [Backend] Status check result:", ALLOWED_STATUSES.includes(status));

      if (!ALLOWED_STATUSES.includes(status)) {
        console.log("❌ [Backend] Validation failed: Invalid status", status);
        console.log("❌ [Backend] Full request body:", JSON.stringify(request.body, null, 2));
        return reply
          .code(400)
          .send({
            error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}. Received: "${status}" (${typeof status})`,
          });
      }
      clientStatus = status;
    }

    console.log("✅ [Backend] Basic validation passed, client status:", clientStatus);

    // If creating a CLIENT (not PROSPECT), password is required
    if (clientStatus === "CLIENT") {
      console.log("🔐 [Backend] CLIENT status detected, validating password");
      if (!password || typeof password !== "string" || password.trim().length < 6) {
        console.log("❌ [Backend] Password validation failed");
        return reply
          .code(400)
          .send({ error: "Password is required and must be at least 6 characters for CLIENT status" });
      }
      console.log("✅ [Backend] Password validation passed");
    }

    console.log("🚀 [Backend] Calling clientService.addNewClient");

    // Compute full name from firstName and lastName
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const client = await clientService.addNewClient(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName, // Keep for backward compatibility
        email,
        phoneNumber,
        whatsappNumber: whatsappNumber || null,
        status: clientStatus,
        notes,
        provenance,
        interestedApartments: apartmentId,
        password: clientStatus === "CLIENT" ? password : undefined
      },
      request.user
    );

    console.log("✅ [Backend] Client created successfully:", { id: client.id, email: client.email, status: client.status });
    return reply.code(201).send(client);
  } catch (err) {
    console.error("💥 [Backend] Error in createClient:", err);
    console.error("💥 [Backend] Error stack:", err.stack);
    console.error("💥 [Backend] Request body that caused error:", request.body);
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function updateClient(request, reply) {
  try {
    const clientId = parseInt(request.params.clientId, 10);
    if (!isPositiveInt(clientId)) {
      return reply
        .code(400)
        .send({ error: "clientId must be a positive integer" });
    }

    const { firstName, lastName, name, email, phoneNumber, whatsappNumber, status, notes, provenance, apartmentId, password } = request.body;

    console.log("🔍 [Backend] Update client request:", {
      clientId, firstName, lastName, name, email, phoneNumber, whatsappNumber, status, notes, provenance,
      apartmentId, password: password ? "[REDACTED]" : undefined
    });

    // Validate firstName if provided
    if (firstName !== undefined) {
      if (typeof firstName !== "string" || firstName.trim() === "") {
        return reply
          .code(400)
          .send({ error: "firstName must be a non-empty string" });
      }
    }

    // Validate lastName if provided
    if (lastName !== undefined) {
      if (typeof lastName !== "string" || lastName.trim() === "") {
        return reply
          .code(400)
          .send({ error: "lastName must be a non-empty string" });
      }
    }

    // Validate name if provided (for backward compatibility)
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return reply
          .code(400)
          .send({ error: "name must be a non-empty string" });
      }
      // name = name.trim();
    }
    if (email !== undefined && !validateEmail(email)) {
      return reply.code(400).send({ error: "email is invalid" });
    }
    if (
      phoneNumber !== undefined &&
      !validatePhoneNumber(phoneNumber)
    ) {
      return reply.code(400).send({ error: "phoneNumber is invalid" });
    }

    // Validate WhatsApp number if provided
    if (whatsappNumber !== undefined && whatsappNumber !== null && whatsappNumber !== "") {
      if (!validatePhoneNumber(whatsappNumber)) {
        return reply.code(400).send({ error: "whatsappNumber is invalid" });
      }
    }

    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
      return reply
        .code(400)
        .send({
          error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        });
    }
    if (notes !== undefined && typeof notes !== "string") {
      return reply.code(400).send({ error: "notes must be a string" });
    }

    // Validate password if provided (for PROSPECT to CLIENT conversion)
    if (password !== undefined) {
      if (typeof password !== "string" || password.trim().length < 6) {
        return reply
          .code(400)
          .send({ error: "Password must be at least 6 characters long" });
      }
    }

    // Prepare update data
    const updateData = {
      firstName,
      lastName,
      name,
      email,
      phoneNumber,
      whatsappNumber,
      status,
      notes,
      provenance,
      interestedApartments: apartmentId,
      password
    };

    // Remove undefined values to avoid overwriting with undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // If firstName and lastName are both provided, update the computed name
    if (firstName !== undefined && lastName !== undefined) {
      updateData.name = `${firstName.trim()} ${lastName.trim()}`;
    } else if (firstName !== undefined || lastName !== undefined) {
      // If only one is provided, we need to get the current client to compute the full name
      const currentClient = await clientService.findClientById(clientId, request.user);
      const currentFirstName = firstName !== undefined ? firstName.trim() : currentClient.firstName;
      const currentLastName = lastName !== undefined ? lastName.trim() : currentClient.lastName;
      updateData.name = `${currentFirstName} ${currentLastName}`;
    }

    const updated = await clientService.updateClient(
      clientId,
      updateData,
      request.user
    );
    return reply.send(updated);
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function deleteClient(request, reply) {
  try {
    const clientId = parseInt(request.params.clientId, 10);
    if (!isPositiveInt(clientId)) {
      return reply
        .code(400)
        .send({ error: "clientId must be a positive integer" });
    }

    await clientService.removeClient(clientId, request.user);
    return reply.code(204).send();
  } catch (err) {
    request.log.error(err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

async function getClientsDisplay(request, reply) {
  try {
    console.log("🎯 [Backend] GET /api/clients/display - Generating HTML display");

    const clients = await clientService.findAllClients(request.user);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Real Estate SaaS - All Clients Database Content</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        .summary {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .client-card {
            background: white;
            margin: 15px 0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
        }
        .client-header {
            background: #f8f9fa;
            padding: 10px;
            margin: -20px -20px 15px -20px;
            border-radius: 8px 8px 0 0;
            border-bottom: 2px solid #e9ecef;
        }
        .status-prospect { color: #ffc107; font-weight: bold; }
        .status-client { color: #28a745; font-weight: bold; }
        .section { margin: 15px 0; }
        .section-title {
            font-weight: bold;
            color: #495057;
            margin-bottom: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .apartment-item {
            background: #f8f9fa;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            border-left: 3px solid #17a2b8;
        }
        .user-account {
            background: #e8f5e8;
            padding: 10px;
            border-radius: 5px;
            border-left: 3px solid #28a745;
        }
        .no-data { color: #6c757d; font-style: italic; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; }
        .refresh-btn {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        }
        .refresh-btn:hover { background: #5a6fd8; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏢 Real Estate SaaS - Database Content</h1>
        <p>Complete Client Database Overview</p>
        <button class="refresh-btn" onclick="window.location.reload()">🔄 Refresh Data</button>
    </div>

    <div class="summary">
        <h2>📊 Database Summary</h2>
        <table>
            <tr><th>Metric</th><th>Count</th></tr>
            <tr><td>Total Clients</td><td><strong>${clients.length}</strong></td></tr>
            <tr><td>PROSPECT Clients</td><td><strong>${clients.filter(c => c.status === 'PROSPECT').length}</strong></td></tr>
            <tr><td>CLIENT Clients</td><td><strong>${clients.filter(c => c.status === 'CLIENT').length}</strong></td></tr>
            <tr><td>Clients with User Accounts</td><td><strong>${clients.filter(c => c.user).length}</strong></td></tr>
            <tr><td>Clients with Interested Apartments</td><td><strong>${clients.filter(c => c.interestedApartments && c.interestedApartments.length > 0).length}</strong></td></tr>
            <tr><td>Clients with Reserved Apartments</td><td><strong>${clients.filter(c => c.apartments && c.apartments.length > 0).length}</strong></td></tr>
        </table>
    </div>

    ${clients.map((client, index) => `
        <div class="client-card">
            <div class="client-header">
                <h3>👤 Client #${index + 1}: ${client.firstName || ''} ${client.lastName || ''}</h3>
                <span class="status-${client.status?.toLowerCase() || 'unknown'}">${client.status || 'Unknown'}</span>
            </div>

            <div class="section">
                <div class="section-title">📋 Basic Information</div>
                <table>
                    <tr><td><strong>ID:</strong></td><td>${client.id}</td></tr>
                    <tr><td><strong>First Name:</strong></td><td>${client.firstName || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Last Name:</strong></td><td>${client.lastName || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Full Name:</strong></td><td>${client.name || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${client.email || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Phone:</strong></td><td>${client.phoneNumber || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>WhatsApp:</strong></td><td>${client.whatsappNumber || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Provenance:</strong></td><td>${client.provenance || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Notes:</strong></td><td>${client.notes || '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Created:</strong></td><td>${client.createdAt ? new Date(client.createdAt).toLocaleString() : '<span class="no-data">N/A</span>'}</td></tr>
                    <tr><td><strong>Updated:</strong></td><td>${client.updatedAt ? new Date(client.updatedAt).toLocaleString() : '<span class="no-data">N/A</span>'}</td></tr>
                </table>
            </div>

            ${client.user ? `
                <div class="section">
                    <div class="section-title">🔐 User Account</div>
                    <div class="user-account">
                        <table>
                            <tr><td><strong>User ID:</strong></td><td>${client.user.id}</td></tr>
                            <tr><td><strong>Name:</strong></td><td>${client.user.name || '<span class="no-data">N/A</span>'}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>${client.user.email || '<span class="no-data">N/A</span>'}</td></tr>
                            <tr><td><strong>Role:</strong></td><td>${client.user.role || '<span class="no-data">N/A</span>'}</td></tr>
                            <tr><td><strong>Status:</strong></td><td>${client.user.status || '<span class="no-data">N/A</span>'}</td></tr>
                        </table>
                    </div>
                </div>
            ` : `
                <div class="section">
                    <div class="section-title">🔐 User Account</div>
                    <div class="no-data">No user account linked</div>
                </div>
            `}

            ${client.createdBy ? `
                <div class="section">
                    <div class="section-title">👨‍💼 Created By</div>
                    <table>
                        <tr><td><strong>Agent ID:</strong></td><td>${client.createdBy.id}</td></tr>
                        <tr><td><strong>Name:</strong></td><td>${client.createdBy.name || '<span class="no-data">N/A</span>'}</td></tr>
                        <tr><td><strong>Email:</strong></td><td>${client.createdBy.email || '<span class="no-data">N/A</span>'}</td></tr>
                    </table>
                </div>
            ` : ''}

            ${client.interestedApartments && client.interestedApartments.length > 0 ? `
                <div class="section">
                    <div class="section-title">🏠 Interested Apartments (${client.interestedApartments.length})</div>
                    ${client.interestedApartments.map(apt => `
                        <div class="apartment-item">
                            <strong>Apartment #${apt.number || apt.id}</strong><br>
                            Type: ${apt.type || 'N/A'} | Area: ${apt.area || 'N/A'}m² | Price: ${apt.price ? apt.price.toLocaleString() + '€' : 'N/A'}<br>
                            Status: ${apt.status || 'N/A'} | Floor: ${apt.floor || 'N/A'}<br>
                            ${apt.project ? `Project: ${apt.project.name}` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="section">
                    <div class="section-title">🏠 Interested Apartments</div>
                    <div class="no-data">No interested apartments</div>
                </div>
            `}

            ${client.apartments && client.apartments.length > 0 ? `
                <div class="section">
                    <div class="section-title">🔒 Reserved Apartments (${client.apartments.length})</div>
                    ${client.apartments.map(apt => `
                        <div class="apartment-item">
                            <strong>Apartment #${apt.number || apt.id}</strong><br>
                            Type: ${apt.type || 'N/A'} | Area: ${apt.area || 'N/A'}m² | Price: ${apt.price ? apt.price.toLocaleString() + '€' : 'N/A'}<br>
                            Status: ${apt.status || 'N/A'} | Floor: ${apt.floor || 'N/A'}<br>
                            ${apt.project ? `Project: ${apt.project.name}` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="section">
                    <div class="section-title">🔒 Reserved Apartments</div>
                    <div class="no-data">No reserved apartments</div>
                </div>
            `}
        </div>
    `).join('')}

    <div style="text-align: center; margin: 40px 0; color: #6c757d;">
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>Real Estate SaaS Database Content Display</p>
    </div>
</body>
</html>`;

    reply.type('text/html');
    return reply.send(html);
  } catch (err) {
    console.error("💥 [Backend] Error in getClientsDisplay:", err);
    return reply.code(err.statusCode || 500).send({ error: err.message });
  }
}

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientsDisplay,
};
