
using System.ComponentModel.DataAnnotations;

namespace AzureSecurityLab.Api.Models;

public sealed class CreateValidationTestRequest
{
    [Required(ErrorMessage = "Product name is required.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Product name must be between 3 and 100 characters.")]
    public string Name { get; init; } = string.Empty;

    [Range(1, 1000, ErrorMessage = "Quantity must be between 1 and 1000.")]
    public int Quantity { get; init; }

    [Range(typeof(decimal), "0.01", "1000000", ErrorMessage = "Price must be between 0.01 and 1000000.")]
    public decimal Price { get; init; }
}
