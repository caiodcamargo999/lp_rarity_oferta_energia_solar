/**
 * Serviço de Integração com Go High Level (GHL)
 * 
 * Este serviço permite:
 * - Criar contatos automaticamente
 * - Adicionar oportunidades ao pipeline específico
 * - Atualizar dados de leads existentes
 * 
 * Documentação da API: https://highlevel.stoplight.io/docs/integrations/
 */

export interface GHLContact {
  firstName: string
  lastName?: string
  name: string
  email: string
  phone: string
  address1?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  website?: string
  timezone?: string
  dnd?: boolean
  tags?: string[]
  customFields?: Record<string, any>
  source?: string
  companyName?: string
}

export interface GHLOpportunity {
  pipelineId: string
  stageId: string
  name: string
  monetaryValue?: number
  assignedTo?: string
  status: 'open' | 'won' | 'lost' | 'abandoned'
  contactId: string
  notes?: string
  customFields?: Record<string, any>
}

export interface GHLResponse<T = any> {
  contact?: T
  opportunity?: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface GHLPipeline {
  id: string;
  name: string;
  stages: any[];
}

// Configuração das credenciais do GHL
export const getGHLConfig = () => {
  const apiKey = process.env.GHL_API_KEY
  const locationId = process.env.GHL_LOCATION_ID
  const baseUrl = process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com'

  if (!apiKey) {
    throw new Error('GHL_API_KEY não está configurado')
  }

  if (!locationId) {
    throw new Error('GHL_LOCATION_ID não está configurado')
  }

  return {
    apiKey,
    locationId,
    baseUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    }
  }
}

/**
 * Cria ou atualiza um contato no Go High Level
 */
export async function createOrUpdateContact(contactData: GHLContact): Promise<GHLResponse> {
  try {
    const config = getGHLConfig()

    console.log('🔗 Criando contato no Go High Level:', contactData.email)

    // Primeiro, verificar se o contato já existe
    const searchResponse = await fetch(
      `${config.baseUrl}/contacts/search/duplicate?locationId=${config.locationId}&email=${encodeURIComponent(contactData.email)}`,
      {
        method: 'GET',
        headers: config.headers
      }
    )

    const searchResult = await searchResponse.json()

    if (searchResult.contact) {
      // Contato já existe, vamos atualizar
      console.log('📝 Contato já existe, atualizando dados...')

      const updateResponse = await fetch(
        `${config.baseUrl}/contacts/${searchResult.contact.id}`,
        {
          method: 'PUT',
          headers: config.headers,
          body: JSON.stringify(contactData)
        }
      )

      const updateResult = await updateResponse.json()

      if (updateResponse.ok) {
        console.log('✅ Contato atualizado no GHL:', updateResult.contact?.id)
        return {
          contact: updateResult.contact,
          success: true,
          message: 'Contato atualizado com sucesso'
        }
      } else {
        throw new Error(`Erro ao atualizar contato: ${updateResult.message}`)
      }
    } else {
      // Contato não existe, vamos criar
      console.log('👤 Criando novo contato...')

      const createResponse = await fetch(
        `${config.baseUrl}/contacts/`,
        {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify({
            ...contactData,
            locationId: config.locationId
          })
        }
      )

      const createResult = await createResponse.json()

      if (createResponse.ok) {
        console.log('✅ Contato criado no GHL:', createResult.contact?.id)
        return {
          contact: createResult.contact,
          success: true,
          message: 'Contato criado com sucesso'
        }
      } else {
        throw new Error(`Erro ao criar contato: ${createResult.message}`)
      }
    }

  } catch (error) {
    console.error('❌ Erro ao processar contato no GHL:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    }
  }
}

/**
 * Cria uma oportunidade (lead) no pipeline específico
 */
export async function createOpportunity(contactId: string, opportunityData: Partial<GHLOpportunity>): Promise<GHLResponse> {
  try {
    const config = getGHLConfig()

    // 1. Determinar o Pipeline ID
    let pipelineId = opportunityData.pipelineId || process.env.GHL_PIPELINE_ID;
    if (!pipelineId) {
      const pipelineName = process.env.GHL_PIPELINE_NAME || '[Rarity Brasil] Empresas de Energia Solar no Brasil';
      const pipeline = await getPipelineByName(pipelineName);
      if (pipeline) {
        pipelineId = pipeline.id;
      } else {
        throw new Error(`Pipeline padrão "${pipelineName}" não encontrado.`);
      }
    }

    // 2. Determinar o Stage ID
    let stageId = opportunityData.stageId || process.env.GHL_STAGE_ID;
    if (!stageId) {
      const stages = await getStagesForPipeline(pipelineId);
      const targetStage = stages.find(
        (stage: any) =>
          stage.name.toLowerCase().includes('reunião') ||
          stage.name.toLowerCase().includes('agendada') ||
          stage.name.toLowerCase().includes('reuniao')
      );
      if (targetStage) {
        stageId = targetStage.id;
      } else {
        // Se não encontrar o stage "Reunião Agendada", usa o primeiro stage do pipeline
        if (stages.length > 0) {
          stageId = stages[0].id;
          console.warn(`⚠️ Stage "Reunião Agendada" não encontrado. Usando o primeiro stage do pipeline: ${stages[0].name}`);
        } else {
          throw new Error('Nenhum stage encontrado para o pipeline.');
        }
      }
    }

    const opportunityPayload = {
      pipelineId: pipelineId,
      pipelineStageId: stageId,
      name: opportunityData.name || 'Lead da Landing Page',
      monetaryValue: opportunityData.monetaryValue || 25000, // R$ 25.000 (valor padrão mencionado no formulário)
      status: 'open' as const,
      contactId,
      customFields: opportunityData.customFields || [],
      locationId: config.locationId
    }

    console.log('💼 Criando oportunidade no GHL:', opportunityPayload)

    const response = await fetch(
      `${config.baseUrl}/opportunities/`,
      {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(opportunityPayload)
      }
    )

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Oportunidade criada no GHL:', result.id)
      return {
        opportunity: result,
        success: true,
        message: 'Oportunidade criada com sucesso'
      }
    } else {
      throw new Error(`Erro ao criar oportunidade: ${result.message}`)
    }

  } catch (error) {
    console.error('❌ Erro ao criar oportunidade no GHL:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    }
  }
}

/**
 * Adiciona tags ao contato
 */
export async function addTagsToContact(contactId: string, tags: string[]): Promise<GHLResponse> {
  try {
    const config = getGHLConfig()

    console.log(`🏷️ Adicionando tags ao contato ${contactId}:`, tags)

    const response = await fetch(
      `${config.baseUrl}/contacts/${contactId}/tags`,
      {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
          tags,
          locationId: config.locationId
        })
      }
    )

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Tags adicionadas com sucesso')
      return {
        success: true,
        message: 'Tags adicionadas com sucesso'
      }
    } else {
      throw new Error(`Erro ao adicionar tags: ${result.message}`)
    }

  } catch (error) {
    console.error('❌ Erro ao adicionar tags no GHL:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

/**
 * Função principal para processar um lead completo no GHL
 */
export async function processLeadInGHL(leadData: {
  name: string
  email: string
  whatsapp: string
  painPoint: string
  hasBudget: string
  sourcePage: string
  scheduledDateTime?: string
  company?: string
  revenue?: string
}): Promise<GHLResponse> {
  try {
    console.log('🚀 Processando lead completo no Go High Level:', leadData.email)

    // 1. Preparar dados do contato
    const [firstName, ...lastNameParts] = leadData.name.trim().split(' ')
    const lastName = lastNameParts.join(' ')

    const contactData: GHLContact = {
      firstName,
      lastName: lastName || '',
      name: leadData.name,
      email: leadData.email,
      phone: leadData.whatsapp.replace(/\D/g, ''), // Remove formatação do telefone
      companyName: leadData.company,
      source: `Landing Page - ${leadData.sourcePage}`,
      timezone: 'America/Sao_Paulo',
      tags: [
        leadData.sourcePage === '/2' ? 'página v2' : 'página v1',
        leadData.hasBudget === 'sim' ? 'tem orçamento' : 'não possui orçamento'
      ],
      customFields: [
        {
          key: 'maior_dor',
          value: leadData.painPoint
        },
        {
          key: 'tem_orcamento',
          value: leadData.hasBudget
        },
        {
          key: 'pagina_origem',
          value: leadData.sourcePage
        },
        {
          key: 'data_hora_agendamento',
          value: leadData.scheduledDateTime || 'Não agendado'
        },
        {
          key: 'faturamento',
          value: leadData.revenue || 'Não informado'
        }
      ]
    }

    // 2. Criar ou atualizar contato
    const contactResult = await createOrUpdateContact(contactData)

    if (!contactResult.success || !contactResult.contact) {
      throw new Error(`Falha ao processar contato: ${contactResult.message}`)
    }

    const contactId = contactResult.contact.id

    // 3. Criar oportunidade no pipeline
    const opportunityName = `${leadData.name} - ${leadData.hasBudget === 'sim' ? 'Com Orçamento' : 'Sem Orçamento'}`
    const opportunityNotes = `
🚨 LEAD DA LANDING PAGE - MOVER PARA "REUNIÃO AGENDADA" 🚨

Lead capturado da landing page ${leadData.sourcePage}

Maior Dor/Desafio: ${leadData.painPoint}
Tem Orçamento: ${leadData.hasBudget}
Empresa: ${leadData.company || 'Não informada'}
Faturamento: ${leadData.revenue || 'Não informado'}
Data/Hora Agendamento: ${leadData.scheduledDateTime || 'Não agendado'}

WhatsApp: ${leadData.whatsapp}
Email: ${leadData.email}

⚠️ AÇÃO NECESSÁRIA: Mover esta oportunidade para o stage "Reunião Agendada"
    `.trim()

    console.log('💼 Criando oportunidade para contato:', contactId)
    console.log('📋 Dados da oportunidade:', {
      name: opportunityName,
      notes: opportunityNotes,
      monetaryValue: leadData.hasBudget === 'sim' ? 25000 : 0,
      customFields: [
        {
          key: 'maior_dor',
          value: leadData.painPoint
        },
        {
          key: 'tem_orcamento',
          value: leadData.hasBudget
        },
        {
          key: 'pagina_origem',
          value: leadData.sourcePage
        },
        {
          key: 'faturamento',
          value: leadData.revenue || 'Não informado'
        }
      ]
    })

    const opportunityResult = await createOpportunity(contactId, {
      name: opportunityName,
      notes: opportunityNotes,
      monetaryValue: leadData.hasBudget === 'sim' ? 25000 : 0, // R$ 25.000 se tem orçamento
      customFields: [
        {
          key: 'maior_dor',
          value: leadData.painPoint
        },
        {
          key: 'tem_orcamento',
          value: leadData.hasBudget
        },
        {
          key: 'pagina_origem',
          value: leadData.sourcePage
        },
        {
          key: 'faturamento',
          value: leadData.revenue || 'Não informado'
        }
      ]
    })

    console.log('📊 Resultado da oportunidade:', opportunityResult)

    if (!opportunityResult.success) {
      console.error('❌ Erro ao criar oportunidade:', opportunityResult.message)
      console.error('❌ Erros detalhados:', opportunityResult.errors)
    } else {
      console.log('✅ Oportunidade criada com sucesso:', opportunityResult.opportunity?.id)
    }

    console.log('🎉 Lead processado com sucesso no Go High Level!')

    // 4. Enviar notificação por email
    try {
      const notifyResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ghl-notify-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadData,
          contactId: contactResult.contact?.id,
          opportunityId: opportunityResult.opportunity?.id
        })
      })

      if (notifyResponse.ok) {
        console.log('📧 Notificação por email enviada com sucesso!')
      } else {
        console.warn('⚠️ Erro ao enviar notificação por email')
      }
    } catch (notifyError) {
      console.warn('⚠️ Erro ao enviar notificação por email:', notifyError)
    }

    return {
      contact: contactResult.contact,
      opportunity: opportunityResult.opportunity,
      success: true,
      message: 'Lead processado com sucesso no Go High Level'
    }

  } catch (error) {
    console.error('❌ Erro ao processar lead no GHL:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      errors: [error instanceof Error ? error.message : 'Erro desconhecido']
    }
  }
}

/**
 * Testa a conexão com a API do Go High Level
 */
export async function testGHLConnection(): Promise<GHLResponse> {
  try {
    const config = getGHLConfig()

    console.log('🧪 Testando conexão com Go High Level...')

    const response = await fetch(
      `${config.baseUrl}/locations/${config.locationId}`,
      {
        method: 'GET',
        headers: config.headers
      }
    )

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Conexão com GHL testada com sucesso')
      return {
        success: true,
        message: 'Conexão com Go High Level estabelecida com sucesso',
        contact: result
      }
    } else {
      throw new Error(`Erro na API: ${result.message}`)
    }

  } catch (error) {
    console.error('❌ Erro ao testar conexão com GHL:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro de conexão',
      errors: [error instanceof Error ? error.message : 'Erro de conexão']
    }
  }
}

/**
 * Busca um pipeline pelo nome.
 */
export async function getPipelineByName(name: string): Promise<GHLPipeline | null> {
  try {
    const config = getGHLConfig();
    console.log(`🔍 Buscando pipeline com nome: ${name}`);

    const response = await fetch(
      `${config.baseUrl}/opportunities/pipelines?locationId=${config.locationId}`,
      {
        method: 'GET',
        headers: config.headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro na API ao buscar pipelines: ${errorData.message}`);
    }

    const { pipelines } = await response.json();
    const foundPipeline = pipelines.find(
      (pipeline: any) => pipeline.name.toLowerCase() === name.toLowerCase()
    );

    if (foundPipeline) {
      console.log(`✅ Pipeline encontrado: ${foundPipeline.id}`);
      return foundPipeline;
    } else {
      console.warn(`⚠️ Pipeline com nome "${name}" não encontrado.`);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao buscar pipeline por nome:', error);
    return null;
  }
}

/**
 * Busca os stages de um pipeline específico.
 */
export async function getStagesForPipeline(pipelineId: string): Promise<any[]> {
  try {
    const config = getGHLConfig();
    console.log(`🔍 Buscando stages para o pipeline: ${pipelineId}`);

    const response = await fetch(
      `${config.baseUrl}/opportunities/pipelines/${pipelineId}`,
      {
        method: 'GET',
        headers: config.headers,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta da API GHL (stages):', errorText);
      throw new Error(`Erro na API ao buscar stages: ${errorText}`);
    }

    const pipeline = await response.json();
    const stages = pipeline.stages;
    console.log(`📊 Stages encontrados: ${stages.length}`);
    return stages;
  } catch (error) {
    console.error('❌ Erro ao buscar stages do pipeline:', error);
    return [];
  }
}

