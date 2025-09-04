package models

import (
	"io/fs"
	"os"
	"path/filepath"

	yaml "gopkg.in/yaml.v3"
)

// accountCategoryConfig defines YAML structure in ./conf/AccountConfig.yml
// Example:
// asset:
//   - 1
//   - 2
//
// liability:
//   - 3
//   - 5
type accountCategoryConfig struct {
	Asset     []int `yaml:"asset"`
	Liability []int `yaml:"liability"`
}

// init tries to load category config from ./conf/AccountConfig.yml
// If file not exists or fails to parse, defaults in account.go remain effective.
func init() { //nolint:gochecknoinits
	_ = loadAccountCategoryFromYaml()
}

func loadAccountCategoryFromYaml() error {
	configPath := filepath.Join(".", "conf", "AccountConfig.yml")

	stat, err := os.Stat(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}

	if stat.IsDir() {
		return fs.ErrInvalid
	}

	content, err := os.ReadFile(configPath)
	if err != nil {
		return err
	}

	cfg := &accountCategoryConfig{}
	if err = yaml.Unmarshal(content, cfg); err != nil {
		return err
	}

	// Rebuild maps based on yaml; unknown ids are allowed.
	newAsset := make(map[AccountCategory]bool, len(cfg.Asset))
	for _, id := range cfg.Asset {
		newAsset[AccountCategory(id)] = true
	}

	newLiability := make(map[AccountCategory]bool, len(cfg.Liability))
	for _, id := range cfg.Liability {
		newLiability[AccountCategory(id)] = true
	}

	// Override the defaults
	assetAccountCategory = newAsset
	liabilityAccountCategory = newLiability

	return nil
}
