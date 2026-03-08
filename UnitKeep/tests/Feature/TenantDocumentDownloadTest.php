<?php

namespace Tests\Feature;

use App\Models\TenantDocument;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TenantDocumentDownloadTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_documents_download_from_the_database_when_available(): void
    {
        $user = User::factory()->create([
            'role' => 'tenant',
        ]);

        TenantProfile::create([
            'user_id' => $user->id,
            'phone' => '+63 900 000 0000',
            'date_of_birth' => '1995-01-01',
            'address' => 'Unit 101',
        ]);

        TenantDocument::create([
            'slug' => 'lease-agreement-form',
            'title' => 'Lease Agreement Form',
            'file_name' => 'lease-agreement-form.pdf',
            'mime_type' => 'application/pdf',
            'content_base64' => base64_encode('database-pdf-content'),
            'file_size' => strlen('database-pdf-content'),
        ]);

        $response = $this
            ->actingAs($user)
            ->get(route('tenant.documents.download', 'lease-agreement-form'));

        $response
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf')
            ->assertHeader('content-disposition', 'attachment; filename="lease-agreement-form.pdf"');

        self::assertSame('database-pdf-content', $response->getContent());
    }

    public function test_tenant_documents_fall_back_to_storage_files_when_database_record_is_missing(): void
    {
        Storage::fake('public');

        $user = User::factory()->create([
            'role' => 'tenant',
        ]);

        TenantProfile::create([
            'user_id' => $user->id,
            'phone' => '+63 900 000 0000',
            'date_of_birth' => '1995-01-01',
            'address' => 'Unit 101',
        ]);

        Storage::disk('public')->put('documents/lease-agreement-form.pdf', 'storage-pdf-content');

        $response = $this
            ->actingAs($user)
            ->get(route('tenant.documents.download', 'lease-agreement-form'));

        $response
            ->assertOk()
            ->assertDownload('lease-agreement-form.pdf');
    }
}
